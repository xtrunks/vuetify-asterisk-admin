'use strict'

const Company = use('App/Models/Company')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const Env = use('Env')

const fillable = ['name', 'address', 'email', 'phone', 'contact_person', 'description', 'province', 'city', 'lat', 'lng']

class CompanyController {
    /**
     * Index
     * Get List of Companies
     */
    async index({ request, response }) {
        let { page, limit, search } = request.get()

        if (!page) page = 1
        if (!limit) limit = 10

        if (search && search != '') {
            const data = await Company.query()
                .where('name', 'like', `%${search}%`)
                .orWhere('address', 'like', `%${search}%`)
                .orWhere('email', 'like', `%${search}%`)
                .orWhere('phone', 'like', `%${search}%`)
                .orWhere('contact_person', 'like', `%${search}%`)
                .orWhere('description', 'like', `%${search}%`)
                .orWhere('province', 'like', `%${search}%`)
                .orWhere('city', 'like', `%${search}%`)
                .paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())
            return response.status(200).send(parsed)
        } else {
            let redisKey = `Company_${page}_${limit}`
            if(Env.get('REDIS_ENABLED',false)) {
                let cached = await RedisHelper.get(redisKey)

                if (cached != null) {
                    return response.status(200).send(cached)
                }
            }

            const data = await Company.query().orderBy('name').paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())

            if(Env.get('REDIS_ENABLED',false)) {
                await RedisHelper.set(redisKey, parsed)
            }

            return response.status(200).send(parsed)
        }
    }

    /**
     * Store
     * Store New Companys
     * Can only be done by Super Administrator
     */

    async store({ request, response, auth }) {
        let body = request.only(fillable)
        const data = await Company.create(body)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Company_*')
            await RedisHelper.delete('Dashboard_Data')
        }

        const activity = `Add new Company '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)
        let parsed = ResponseParser.apiCreated(data.toJSON())
        return response.status(201).send(parsed)
    }

    /**
     * Show
     * Company by id
     */
    async show({ request, response }) {
        const id = request.params.id
        let redisKey = `Company_${id}`

        if(Env.get('REDIS_ENABLED',false)) {
            let cached = await RedisHelper.get(redisKey)
            if (cached) {
                return response.status(200).send(cached)
            }
        }

        const data = await Company.find(id)
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
     * Update Company by Id
     * Can only be done by Super Administrator
     */
    async update({ request, response, auth }) {
        let body = request.only(fillable)
        const id = request.params.id
        const data = await Company.find(id)
        if (!data || data.length === 0) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        await data.merge(body)
        await data.save()
        const activity = `Update Company '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Company_*')
            await RedisHelper.delete('Dashboard_Data')
        }

        let parsed = ResponseParser.apiUpdated(data.toJSON())
        return response.status(200).send(parsed)
    }

    /**
     * Delete
     * Delete Company by Id
     * Can only be done by Super Administrator
     * Default Company ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
     */
    async destroy({ request, response, auth }) {
        const id = request.params.id
        const data = await Company.find(id)
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        const activity = `Delete Company '${data.name}'`
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('Company_*')
            await RedisHelper.delete('Dashboard_Data')
        }

        await data.delete()
        return response.status(200).send(ResponseParser.apiDeleted())
    }
}

module.exports = CompanyController
