'use strict'

const Task = use('Task')
const User = use('App/Models/User')
const Company = use('App/Models/Company')
const Dashboard = use('App/Models/Dashboard')
const {RedisHelper} = use('App/Helpers')
const Env = use('Env')

class DashboardSchedule extends Task {
    static get schedule () {
        return '0 5 * * * '
    }

    async handle () {
        this.info('Task DashboardSchedule handle')

        const totalCompanies = await Company.query().count('* as total')

        const dashboardDetails = {
            total_companies: totalCompanies[0].total
        }

        const whereClause = {
            id: 1
        }

        await Dashboard.findOrCreate(whereClause, dashboardDetails)
        if(Env.get('REDIS_ENABLED',false)) {
            const redisKey = 'Dashboard_Data'
            await RedisHelper.delete(redisKey)
        }

    }
}

module.exports = DashboardSchedule