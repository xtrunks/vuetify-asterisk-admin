'use strict'

const { ResponseParser } = use('App/Helpers')

class StorePermission {
  get rules() {
    return {
      model: 'required|string|max:20',
      sort_by: 'string|max:20',
      sort_mode: 'string|in:asc,desc',
      limit: 'string|max:6',
      range_by: 'string|max:20',
      range_start: 'string|max:20',
      range_end: 'string|max:20',
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      string: '{{ field }} should be string',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters',
      number: '{{ field }} should be number',
      format: '{{ field }} should be xls or xlsx, csv or ods'
    }
  }

  get sanitizationRules () {
    return {
      model: 'escape',
      sort_by: 'escape',
      sort_mode: 'escape',
      limit: 'toInt',
      range_by: 'escape',
      range_start: 'toDate',
      range_end: 'toDate',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }


}

module.exports = StorePermission
