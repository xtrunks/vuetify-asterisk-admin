'use strict'

const Activity = use('App/Models/Activity')
const { RedisHelper, ResponseParser } = use('App/Helpers')
const Env = use('Env')
class ActivityController {
    /**
     * Index
     * Get List of Activities
     */
    async index({ request, response }) {
        let {
            page,
            limit,
            search,
            search_by,
            search_query,
            between_date,
            start_date,
            end_date,
            sort_by,
            sort_mode,
            user_id
        } = request.get()

        if (!page) page = 1
        if (!limit) limit = 10
        if (!sort_by) sort_by = 'id'
        if (!sort_mode) sort_mode = 'desc'

        if(search && search != '') {
            const data = await Activity.query()
                .with('user', builder => {
                    builder.select('id', 'name')
                })
                .where('ip', 'like', `%${search}%`)
                .orWhere('browser', 'like', `%${search}%`)
                .orWhere('activity', 'like', `%${search}%`)
                .orWhereHas('user', (builder) => {
                    builder.where('name', 'like', `%${search}%`)
                })
                .paginate(parseInt(page), parseInt(limit))
            let parsed = ResponseParser.apiCollection(data.toJSON())
            return response.status(200).send(parsed)
        }
        const redisKey = `Activity_${page}${limit}${search_by}${search_query}${between_date}${start_date}${end_date}${sort_by}${sort_mode}${user_id}`
        if(Env.get('REDIS_ENABLED',false)) {
            let cached = await RedisHelper.get(redisKey)

            if (cached) {
                return response.status(200).send(cached)
            }
        }
        const data = await Activity.query()
            .with('user', builder => {
                builder.select('id', 'name')
            })
            .where(function() {
                if (search_by && search_query) {
                    return this.where(search_by, 'like', `%${search_query}%`)
                }
            })
            .where(function() {
                if (user_id) {
                    return this.where('user_id', parseInt(user_id))
                }
            })
            .where(function() {
                if (between_date && start_date && end_date) {
                    return this.whereBetween(between_date, [start_date, end_date])
                }
            })
            .orderBy(sort_by, sort_mode)
            .paginate(parseInt(page), parseInt(limit))

        let parsed = ResponseParser.apiCollection(data.toJSON())
        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.set(redisKey, parsed)
        }
        return response.status(200).send(parsed)
    }
}

module.exports = ActivityController