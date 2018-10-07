'use strict'

const { ResponseParser } = use('App/Helpers')


class ChangePassword {
  get rules () {
    return {
      old_password: 'required',
      password: 'required|min:6',
      password_confirmation: 'required|same:password',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      same: '{{ field }} is not confirmed',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = ChangePassword
