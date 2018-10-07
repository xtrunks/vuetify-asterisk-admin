'use strict'

const { ResponseParser } = use('App/Helpers')


class List {
  get rules () {
    return {
      page: 'alpha_numeric',
      limit: 'alpha_numeric',
      search: 'max:50',
      role_id: 'alpha_numeric'
    }
  }

  get messages() {
    return {
      alpha_numeric: '{{ field }} need to be in numeric format',
      max: '{{ field }} cannot more than {{ argument.0 }} characters'
    }
  }

  get sanitizationRules () {
    return {
      role_id: 'to_int',
      page: 'to_int',
      limit: 'to_int',
      search: 'escape|strip_tags',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = List
