'use strict'

const User = use('App/Models/User')
const { ResponseParser, RedisHelper } = use('App/Helpers')
const Env = use('Env')

class UserQueryTraits {

    constructor(page, limit, search, role_id) {
        this.search = search || ''
        this.page = page || 1
        this.limit = limit || 10
        this.role_id = role_id || 0
    }

    async qBySearch() {
        const data = await User.query()
            .with('roles')
            .where('name', 'like', `%${this.search}%`)
            .orWhere('email', 'like', `%${this.search}%`)
            .orWhere('phone', 'like', `%${this.search}%`)
            .orWhere('address', 'like', `%${this.search}%`)
            .paginate(parseInt(this.page), parseInt(this.limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())
        return parsed
    }

    async qByRole() {
        let redisKey = `User_${this.page}_${this.limit}_${this.role_id}`
        if(Env.get('REDIS_ENABLED',false)) {
            let cached = await RedisHelper.get(redisKey)
            if (cached != null) {
                return cached
            }
        }

        const data = await User.query()
            .with('roles', (builder) => {
                builder.where('role_id', this.role_id)
            })
            .where('role_id', parseInt(this.role_id))
            .orderBy('name')
            .paginate(parseInt(this.page), parseInt(this.limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, parsed)
        }

        return parsed
    }

    async qDefault() {
        let redisKey = `User_${this.page}_${this.limit}`
        if(Env.get('REDIS_ENABLED',false)) {
            let cached = await RedisHelper.get(redisKey)
            if (cached != null) {
                return cached
            }
        }

        const data = await User.query()
            .with('roles')
            .orderBy('name')
            .paginate(parseInt(this.page), parseInt(this.limit))
        let parsed = ResponseParser.apiCollection(data.toJSON())
        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, parsed)
        }
        return parsed
    }
}

module.exports = UserQueryTraits
