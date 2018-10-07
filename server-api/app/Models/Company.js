'use strict'

const Model = use('Model')

class Company extends Model {
  studies() {
    return this.hasMany('App/Models/StudyPrograms')
  }
}

module.exports = Company
