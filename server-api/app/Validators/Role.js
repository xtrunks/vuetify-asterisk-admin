'use strict'

const { ResponseParser } = use('App/Helpers')

class Role {
  get rules() {
    const id = this.ctx.params.id

    return {
      name: `required|max:50|unique:roles,name,id,${id}`,
      slug: 'required|max:50',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }


}

module.exports = Role
