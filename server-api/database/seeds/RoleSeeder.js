'use strict'

const { Slug } = use('App/Helpers')
const Role = use('App/Models/Role')
const Database = use('Database')

class RoleSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')

    await Role.truncate()
    const roles = ['Superadmin', 'Administrator', 'Supervisor', 'Marketing', 'Student']
    for (let i = 0; i < roles.length; i++) {
      await Role.create({
        name: roles[i],
        slug: Slug(roles[i])
      })

    }

  }
}

module.exports = RoleSeeder
