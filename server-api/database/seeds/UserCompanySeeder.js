'use strict'

const Database = use('Database')

const resources = ['Company']


class UserCompanySeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('user_companies').truncate()
    for (let i = 1; i <= 3; i++) {
      await Database.table('user_companies').insert({
        user_id: 1,
        company_id: i
      })
    }
  }
}

module.exports = UserCompanySeeder
