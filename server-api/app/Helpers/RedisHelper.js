'use strict'

const Redis = use('Redis')
const Env = use('Env')
const redisDeletePattern = require('redis-delete-pattern')

class RedisHelper {

    async get(key) {
        if(Env.get('REDIS_ENABLED',false)){
            const data = await Redis.get(key)
            return JSON.parse(data)
        }
        return false;
    }

    async set(key, data) {
        if(Env.get('REDIS_ENABLED',false)) {
            await Redis.set(key, JSON.stringify(data))
        }
    }

    async clear() {
        await Redis.flushall()
    }

    delete(pattern) {
        return new Promise(
            (resolve, reject) => {
                if(Env.get('REDIS_ENABLED',false)) {
                    redisDeletePattern({
                        redis: Redis,
                        pattern: pattern
                    }, function handleError(err) {
                        if (err) reject(err)
                        resolve('Success')
                    })
                }
            }
        )
    }

}

module.exports = new RedisHelper()
