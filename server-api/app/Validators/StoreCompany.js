'use strict'

const { ResponseParser } = use('App/Helpers')

class StoreCompany {
  get rules () {
    return {
      name: 'required|max:50|unique:companies',
      email: 'required|email|unique:companies',
      phone: 'required|max:30|unique:companies',
      contact_person: 'required|max:50',
      province: 'required|max:50',
      city: 'required|max:50',
      lat: 'number',
      lng: 'number'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      email: '{{ field }} is not a valid email',
      unique: '{{ field }} is already registered',
      max: '{{ field }} cannot more then {{ arguments:0 }} characters'
    }
  }

  get sanitizationRules () {
    return {
      email: 'normalize_email',
      name: 'escape',
      phone: 'escape',
      contact_person: 'escape',
      province: 'escape',
      city: 'escape',
      address: 'escape',
      description: 'escape',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(ResponseParser.apiValidationFailed(errorMessages))
  }
}

module.exports = StoreCompany
