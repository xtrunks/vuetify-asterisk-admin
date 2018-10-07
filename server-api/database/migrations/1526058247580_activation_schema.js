'use strict'

const Schema = use('Schema')

class ActivationSchema extends Schema {
  up () {
    this.create('activations', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().index()
      table.string('code').notNullable().index()
      table.boolean('completed').default(0)
      table.dateTime('completed_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('activations')
  }
}

module.exports = ActivationSchema
