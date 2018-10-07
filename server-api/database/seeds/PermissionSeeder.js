'use strict'

const changeCase = require('change-case')
const Database = use('Database')
const Permission = use('App/Models/Permission')
const resources = [
  'User', 'Role', 'Permission', 'Company', 'Product', 'Schedule', 'StudyName', 'StudyProgram', 'StudyYear',
  'Marketing', 'MarketingAction', 'Supervisor', 'MarketingReport', 'MarketingReportAttachment'
]
const actions = ['create', 'read', 'update', 'delete']

class PermissionSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Permission.truncate()
    await resources.forEach(r => {
      actions.forEach(async (act) => {
        let body = {
          name: changeCase.sentenceCase(act + ' ' + r),
          slug: changeCase.snakeCase(act + ' ' + r)
        }
        await Permission.create(body)
      })
    })
    await this.addOtherPermissions()
  }

  async addOtherPermissions() {
    let permissions = ['Clear Redis']
    permissions.forEach(async (permission) => {
      let body = {
        name: changeCase.sentenceCase(permission),
        slug: changeCase.snakeCase(permission)
      }
      await Permission.create(body)
    })
  }
}

module.exports = PermissionSeeder
