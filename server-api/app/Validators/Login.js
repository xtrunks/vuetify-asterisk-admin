'use strict'

const { ResponseParser } = use('App/Helpers')

class Login {
  get rules () {
    return {
      email: 'required',
      password: 'required',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = Login
