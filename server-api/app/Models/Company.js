'use strict'

const Model = use('Model')

class Company extends Model {
    users() {
        return this
            .belongsToMany('App/Models/User')
            .pivotTable('user_companies')
    }
}

module.exports = Company
