'use strict'

const Permission = use('App/Models/Permission')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const changeCase = require('change-case')
const fillable = ['name', 'description']
const Env = use('Env')

/**
 * PermissionController
 *
 */

class PermissionController {

    /**
     * Index
     * Get List of Permissions
     */
    async index({ request, response }) {
        let { page, limit, search } = request.get()

        if (!page) page = 1
        if (!limit) limit = 10

        if (search && search != '') {
            const data = await Permission.query()
                .where('name', 'like', `%${search}%`)
                .orWhere('slug', 'like', `%${search}%`)
                .orWhere('description', 'like', `%${search}%`)
                .orderBy('id')
                .paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())
            return response.status(200).send(parsed)
        } else {
            let redisKey = `Permission_${page}_${limit}`
            if(Env.get('REDIS_ENABLED',false)) {
                let cached = await RedisHelper.get(redisKey)

                if (cached != null) {
                    return response.status(200).send(cached)
                }
            }
            const data = await Permission.query().orderBy('id').paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())
            //console.log('Hello',Env.get('REDIS_ENABLED',false));
            if(Env.get('REDIS_ENABLED',false)) {
                await RedisHelper.set(redisKey, parsed)
            }

            return response.status(200).send(parsed)
        }
    }

    /**
     * Store
     * Store New Permissions
     * Can only be done by Superadmin
     */
    async store({ request, response, auth }) {
        let body = request.only(fillable)
        body.slug = changeCase.snakeCase(body.name)
        const data = await Permission.create(body)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Permission_*')
        }

        const activity = `Add new Permission '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)
        let parsed = ResponseParser.apiCreated(data.toJSON())
        return response.status(201).send(parsed)
    }

    /**
     * Show
     * Permission by id
     */
    async show({ request, response }) {
        const id = request.params.id
        let redisKey = `Permission_${id}`
        if(Env.get('REDIS_ENABLED',false)) {
            let cached = await RedisHelper.get(redisKey)
            if (cached) {
                return response.status(200).send(cached)
            }
        }
        const data = await Permission.find(id)
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
     * Update Permission by Id
     * Can only be done by Superadmin
     */
    async update({ request, response, auth }) {
        let body = request.only(fillable)
        const id = request.params.id
        const data = await Permission.find(id)
        if (!data || data.length === 0) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        await data.merge(body)
        await data.save()
        const activity = `Update Permission '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Permission_*')
        }

        let parsed = ResponseParser.apiUpdated(data.toJSON())
        return response.status(200).send(parsed)
    }

    /**
     * Delete
     * Delete Permission by Id
     * Can only be done by Superadmin
     */
    async destroy({ request, response, auth }) {
        const id = request.params.id
        const data = await Permission.find(id)
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        const activity = `Delete Permission '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Permission_*')
        }

        await data.delete()
        return response.status(200).send(ResponseParser.apiDeleted())
    }
}

module.exports = PermissionController
