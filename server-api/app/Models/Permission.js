'use strict'

const Model = use('Model')

class Permission extends Model {

  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole'
    ]
  }
}

module.exports = Permission
