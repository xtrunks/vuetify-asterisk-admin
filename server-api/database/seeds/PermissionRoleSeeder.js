'use strict'

const Database = use('Database')

const resources = ['User', 'Role', 'Permission', 'Company']

const otherPermissions = ['Clear Redis']


class PermissionRoleSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Database.table('permission_role').truncate()
    await Database.table('role_user').truncate()

    for (let i = 1; i < (resources.length * 4) + 1 + otherPermissions.length; i++) {
      await Database.table('permission_role').insert({
        role_id: 1,
        permission_id: i
      })
    }
  }
}

module.exports = PermissionRoleSeeder
