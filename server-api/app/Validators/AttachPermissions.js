'use strict'

const { ResponseParser } = use('App/Helpers')

class AttachPermissions {
  get rules() {
    return {
      role_id: 'required|integer',
      permissions: 'array',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      array: '{{ field }} is not a valid array type',
      integer: '{{ field }} should be integer value'

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }


}

module.exports = AttachPermissions
