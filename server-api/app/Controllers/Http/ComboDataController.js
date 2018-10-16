'use strict'

const { RedisHelper } = use('App/Helpers')
const Company = use('App/Models/Company')
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Permission = use('App/Models/Permission')
const Database = use('Database')
const Env = use('Env')

class ComboDataController {
    async index({ request, response }) {
        const { model } = request.get()
        switch (model) {
            case 'Company':
            {
                const data = await this.getCompanies()
                return response.status(200).send(data)
            }

            case 'Permission':
            {
                const data = await this.getPermissions()
                return response.status(200).send(data)
            }

            case 'Role':
            {
                const data = await this.getRoles()
                return response.status(200).send(data)
            }
            default:
                return response.status(400).send({ 'message': 'Model not found' })
        }
    }

    async getCompanies() {
        let redisKey = 'Company_Combo'
        if(Env.get('REDIS_ENABLED',false)) {

            let cached = await RedisHelper.get(redisKey)

            if (cached != null) {
                return cached
            }
        }
        const data = await Company.query().select('id', 'name').orderBy('name').fetch()
        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, data)
        }
        let parsed = data.toJSON()
        return parsed
    }


    async getPermissions() {
        let redisKey = 'Permission_Combo'
        if(Env.get('REDIS_ENABLED',false)) {

            let cached = await RedisHelper.get(redisKey)

            if (cached != null) {
                return cached
            }
        }
        const data = await Permission.query().select('id', 'name').orderBy('id').fetch()
        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, data)
        }
        let parsed = data.toJSON()
        return parsed
    }

    async getRoles() {
        let redisKey = 'Role_Combo'
        if(Env.get('REDIS_ENABLED',false)) {

            let cached = await RedisHelper.get(redisKey)

            if (cached != null) {
                return cached
            }
        }
        const data = await Role.query().select('id', 'name').orderBy('id').fetch()
        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, data)
        }
        let parsed = data.toJSON()
        return parsed
    }
}

module.exports = ComboDataController
