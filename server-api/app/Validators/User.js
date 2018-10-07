'use strict'

const { ResponseParser } = use('App/Helpers')


class User {
  get rules() {
    return {
      name: 'required|max:50',
      email: 'required|email|unique:users',
      phone: 'required|max:30|unique:users',
      password: 'required|min:6',
      roles: 'required|array'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      email: '{{ field }} is not a valid email',
      unique: '{{ field }} is already registered'
    }
  }

  get sanitizationRules() {
    return {
      email: 'normalize_email',
      role_id: 'to_int',
      name: 'escape',
      phone: 'escape',
      address: 'escape',
      description: 'escape',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = User
