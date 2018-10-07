'use strict'

/*
|--------------------------------------------------------------------------
| CompanySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Company = use('App/Models/Company')

class CompanySeeder {
  async run () {
    await Company.truncate()
    await Factory
      .model('App/Models/Company')
      .createMany(3)
  }
}

module.exports = CompanySeeder
