'use strict'

const Model = use('Model')
const Env = use('Env')

class User extends Model {
  static boot() {
    super.boot()
    this.addHook('beforeCreate', ['User.hashPassword', 'User.generateUid'])

  }

  static get hidden() {
    return ['password', 'verification_token']
  }

  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  tokens() {
    return this.hasMany('App/Models/Token')
  }

  getPhoto() {
    if (this.photo) {
      return `${getBaseUrl()}${this.photo}`
    } else return ''
  }

  supervisors() {
    return this
      .belongsToMany('App/Models/User', 'marketing_id', 'supervisor_id', 'id')
      .pivotTable('marketing_supervisor')
  }

  companies() {
      return this
          .belongsToMany('App/Models/Company')
          .pivotTable('user_companies')
  }

  marketings() {
    return this
      .belongsToMany('App/Models/User', 'supervisor_id', 'marketing_id', 'id')
      .pivotTable('marketing_supervisor')
  }
}

module.exports = User

function getBaseUrl() {
  let environment = Env.get('NODE_ENV')
  if(environment === 'production') {
    return Env.get('PRODUCTION_APP_URL')
  } else {
    return Env.get('APP_URL')
  }
}
