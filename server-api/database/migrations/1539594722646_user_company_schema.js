'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCompanySchema extends Schema {
  up () {
    this.create('user_companies', (table) => {
      table.increments()
        table.integer('user_id').unsigned().index()
        table.integer('company_id').unsigned().index()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_companies')
  }
}

module.exports = UserCompanySchema
