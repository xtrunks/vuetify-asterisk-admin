'use strict'

const Model = use('Model')
const {RedisHelper} = use('App/Helpers')
const Env = use('Env')

class Activity extends Model {
    static boot() {
        super.boot()
        this.addHook('beforeCreate', async () => {
            if(Env.get('REDIS_ENABLED',false)) {
                await RedisHelper.delete('Activity_*')
            }
        })

    }
    user() {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Activity
