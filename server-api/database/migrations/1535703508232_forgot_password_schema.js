'use strict'

const Schema = use('Schema')

class ForgotPasswordSchema extends Schema {
  up () {
    this.create('forgot_passwords', (table) => {
      table.increments()
      table.string('email').index()
      table.string('code').index()
      table.dateTime('completed_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('forgot_passwords')
  }
}

module.exports = ForgotPasswordSchema
