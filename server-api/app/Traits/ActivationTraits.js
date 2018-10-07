'use strict'

const moment = require('moment')
const ActivationModel = use('App/Models/Activation')
const randomstring = require('randomstring')
const now = moment().format('YYYY-MM-DD HH:mm:ss')

class ActivationTraits {
  async create(user) {
    if (!user) {
      return null
    }

    const generatedCode = randomstring.generate({
      length: 40,
      charset: 'hex'
    })

    const activation = await ActivationModel.create({
      user_id: user.id,
      code: generatedCode,
      completed: 0,
      created_at: now,
      updated_at: now,
    })
    return activation
  }

  async createAndActivate(user) {
    const activation = await this.create(user)
    activation.merge({
      completed: true,
      completed_at: now
    })
    await activation.save()
    return activation
  }

  async check(user) {
    const { activation } = user
    if (!activation || !activation.completed) {
      return false
    }
    return true
  }

}

module.exports = new ActivationTraits()
