'use strict'

const { ResponseParser } = use('App/Helpers')

class GetForgot {
  get rules () {
    return {
      email: 'required',
      phone: 'required',

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

module.exports = GetForgot
