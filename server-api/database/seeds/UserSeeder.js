'use strict'

const Factory = use('Factory')
const User = use('App/Models/User')
const Database = use('Database')
const moment = require('moment')
const randomstring = require('randomstring')
const now = moment().format('YYYY-MM-DD HH:mm:ss')
const roles = ['SuperAdmin', 'Administrator', 'Supervisor', 'Marketing', 'Student']
const changeCase = require('change-case')

class UserSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('users').truncate()
    await Database.table('tokens').truncate()
    await Database.table('activations').truncate()
    await Database.table('activities').truncate()
    await Database.table('role_user').truncate()

    await User.truncate()
    for (let i = 0; i < roles.length; i++) {
      let userData = {
        name: roles[i],
        email: changeCase.snakeCase(roles[i]) + '@xtrunks.com',
        password: 'xtrunks',
        phone: '3000515119',
        is_active: 1,
      }
      let user = await User.create(userData)
      await user.roles().attach(i + 1)
    }

    // await Factory
    //   .model('App/Models/User')
    //   .createMany(15)
    await this.setActivation()
    await this.seedMarketing()
  }

  async setActivation() {
    for (let i = 1; i <= roles.length; i++) {
      const generatedCode = randomstring.generate({
        length: 40,
        charset: 'hex'
      })

      await Database.table('activations').insert({
        user_id: i,
        code: generatedCode,
        completed: 1,
        completed_at: now,
        created_at: now,
        updated_at: now,
      })

    }
  }

  async seedMarketing() {
    const usersArray = await Factory
      .model('App/Models/User')
      .createMany(5)
    for (let i = 0; i < usersArray.length; i++) {
      await usersArray[i].roles().attach(4)
    }
  }
}

module.exports = UserSeeder
