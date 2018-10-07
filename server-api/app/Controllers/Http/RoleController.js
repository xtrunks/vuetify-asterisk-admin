'use strict'

const Role = use('App/Models/Role')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const Env = use('Env')
const fillable = ['name', 'slug', 'description']

/**
 * RoleController
 *
 */

class RoleController {

    /**
     * Index
     * Get List of Roles
     */
    async index({ request, response }) {
        let { page, limit, search } = request.get()

        //return response.status(200).send({'message':'Hello'})
        if (!page) page = 1
        if (!limit) limit = 10

        if (search && search != '') {
            const data = await Role.query()
                .where('name', 'like', `%${search}%`)
                .orWhere('slug', 'like', `%${search}%`)
                .paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())
            return response.status(200).send(parsed)
        } else {
            let redisKey = `Role_${page}_${limit}`
            if(Env.get('REDIS_ENABLED',false)) {

                let cached = await RedisHelper.get(redisKey)

                if (cached != null) {
                    return response.status(200).send(cached)
                }
            }

            const data = await Role.query().orderBy('name').paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())

            if(Env.get('REDIS_ENABLED',false)) {
                await RedisHelper.set(redisKey, parsed)
            }

            return response.status(200).send(parsed)
        }
    }

    /**
     * Store
     * Store New Roles
     * Can only be done by Super Administrator
     */
    async store({ request, response, auth }) {
        let body = request.only(fillable)
        const data = await Role.create(body)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Role_*')
        }
        const activity = `Add new Role '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)
        let parsed = ResponseParser.apiCreated(data.toJSON())
        return response.status(201).send(parsed)
    }

    /**
     * Show
     * Role by id
     */
    async show({ request, response }) {
        const id = request.params.id
        let redisKey = `Role_${id}`
        if(Env.get('REDIS_ENABLED',false)) {

            let cached = await RedisHelper.get(redisKey)
            if (cached) {
                return response.status(200).send(cached)
            }
        }
        const data = await Role.find(id)
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        let parsed = ResponseParser.apiItem(data.toJSON())

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, parsed)
        }

        return response.status(200).send(parsed)
    }

    /**
     * Update
     * Update Role by Id
     * Can only be done by Super Administrator
     */
    async update({ request, response, auth }) {
        let body = request.only(fillable)
        const id = request.params.id
        const data = await Role.find(id)
        if (!data || data.length === 0) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        await data.merge(body)
        await data.save()
        const activity = `Update Role '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Role_*')
        }

        let parsed = ResponseParser.apiUpdated(data.toJSON())
        return response.status(200).send(parsed)
    }

    /**
     * Delete
     * Delete Role by Id
     * Can only be done by Super Administrator
     * Default Role ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
     */
    async destroy({ request, response, auth }) {
        const id = request.params.id
        const data = await Role.find(id)
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }

        if (id < 5) {
            return response.status(400).send(ResponseParser.errorResponse('Default Role cannot be deleted'))
        }
        const activity = `Delete Role '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Role_*')
        }

        await data.permissions().detach()
        await data.delete()
        return response.status(200).send(ResponseParser.apiDeleted())
    }

    /**
     * Get Permissions by Role ID
     */
    async getPermissions({ request, response }) {
        const id = request.params.id
        let redisKey = `Permissions_Role_${id}`
        if(Env.get('REDIS_ENABLED',false)) {

            let cached = await RedisHelper.get(redisKey)
            if (cached) {
                return response.status(200).send(cached)
            }
        }

        const data = await Role.find(id)
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        const permissions = await data.permissions().fetch()
        let parsed = ResponseParser.apiItem(permissions.toJSON())

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, parsed)
        }
        return response.status(200).send(parsed)
    }

    /**
     * Attach Permission into Role
     */
    async attachPermissions({ request, response }) {
        const { role_id, permissions } = request.post()
        const role = await Role.find(role_id)
        if (!role) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        await role.permissions().detach()
        await role.permissions().attach(permissions)

        // Redis Process
        let redisKey = `Permissions_Role_${role_id}`
        if(Env.get('REDIS_ENABLED',false)) {

            await RedisHelper.delete(redisKey)
        }
        const data = await role.permissions().fetch()
        let parsed = ResponseParser.apiItem(data.toJSON())

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, parsed)
        }

        return response.status(200).send(parsed)

    }
}

module.exports = RoleController