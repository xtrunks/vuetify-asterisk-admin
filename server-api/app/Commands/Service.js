'use strict'

const { Command } = require('@adonisjs/ace')
const changeCase = require('change-case')
const ace = require('@adonisjs/ace')

class Service extends Command {
  static get signature() {
    return 'make:service'
  }

  static get description() {
    return 'Create Service Starter'
  }

  async handle() {
    const name = await this
      .ask('Enter service name')
    const upperName = changeCase.upperCaseFirst(name)
    await ace.call('make:model', { name: upperName }, { migration: true })
    await ace.call('make:controller', { name: upperName })
    await ace.call('make:validator', { name: `Store${upperName}` })
    await ace.call('make:validator', { name: `Update${upperName}` })
    await ace.call('make:seed', { name: upperName + 'Seeder' })
    await ace.call('make:test', { name: upperName + 'Test' })
  }
}

module.exports = Service
