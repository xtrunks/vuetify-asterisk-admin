'use strict'

const Schema = use('Schema')

class ActivitySchema extends Schema {
  up () {
    this.create('activities', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index()
      table.string('ip').notNullable()
      table.string('browser').notNullable()
      table.string('activity').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('activities')
  }
}

module.exports = ActivitySchema
