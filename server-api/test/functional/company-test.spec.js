'use strict'

const Company = use('App/Models/Company')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Companies')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/companies'

/**
 * List of Company
 */

test('Unathorized cannot get Company List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get Company List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Company
 */

test('Unathorized cannot create Company', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(CompanyData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Create Company', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(CompanyData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      name: 'Test Company',
      email: 'test@test.com',
      phone: '08909034789',
    }
  })
})

test('Cannot Create Company with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Company
 */

test('Unathorized cannot Update Company', async ({ client }) => {
  const editing = await Company.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(CompanyData())
    .end()
  response.assertStatus(401)
})

test('Authorized can Update Company', async ({ client }) => {
  const user = await getAdmin()
  const editing = await Company.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(CompanyData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      name: 'Test Company',
      email: 'test@test.com',
      phone: '08909034789',
    }
  })
})

test('Cannot Update unexisted Company', async ({ client }) => {
  const user = await getAdmin()
  const response = await client
    .put(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .send(CompanyData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Company
 */

test('Unathorized cannot Show Company', async ({ client }) => {
  const company = await Company.find(1)
  const response = await client
    .get(endpoint + '/' + company.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Company', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Company.find(2)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Company', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Company
 */

test('Unathorized cannot Delete Company', async ({ client }) => {
  const company = await Company.find(1)
  const response = await client
    .delete(endpoint + '/' + company.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Company', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Company.find(2)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted Company', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .delete(endpoint + '/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Form Data
 */

function CompanyData() {
  return {
    name: 'Test Company',
    email: 'test@test.com',
    phone: '08909034789',
    contact_person: 'Francis Buchanan',
    description: 'Mika voopca hudimzo ninu tolez iroru jibwiroh da zojetemow fennatpac sunwiwvu wi utehko jejvu pigfufnoh vohadiro gi.',
    province: 'YT',
    city: 'Lolkoig'
  }
}

async function getAdmin() {
  return await User.query().whereHas('roles', builder => {
    builder.where('role_id', 1)
  }).first()
}
