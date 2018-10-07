'use strict'

const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: 'password',
    phone: faker.phone(),
    address: faker.address(),
  }
})

Factory.blueprint('App/Models/Company', (faker) => {
  return {
    name: faker.name(),
    email: faker.email(),
    phone: faker.phone(),
    address: faker.address(),
    contact_person: faker.name(),
    description: faker.sentence(),
    province: faker.province(),
    city: faker.city(),
    lat: faker.latitude(),
    lng: faker.longitude(),
  }
})

