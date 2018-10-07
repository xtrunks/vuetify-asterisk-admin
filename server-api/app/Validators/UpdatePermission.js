'use strict'

const { ResponseParser } = use('App/Helpers')

class UpdatePermission {
  get rules() {
    const id = this.ctx.params.id

    return {
      name: 'required|max:50|unique:permissions,name,id,' + id,
      // slug: 'required|max:80|unique:permissions,slug,id,' + id,
      description: 'max:250'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required'
    }
  }

  get sanitizationRules() {
    return {
      name: 'escape',
      slug: 'escape',
      description: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }


}

module.exports = UpdatePermission
