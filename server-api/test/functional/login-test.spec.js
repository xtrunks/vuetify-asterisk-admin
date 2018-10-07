'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Login')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/login'

/**
 * Login
 */

test('Can Login if user is exist and active', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .send({email: user.email, password: 'P4sw0rd@xtrunks.com'})
    .end()
  response.assertStatus(200)
})

test('Cannot Login if user is doesnt exist', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send({email: 'test@test.com', password: 'password'})
    .end()
  response.assertStatus(400)
})

test('Cannot Login if user is exist but not activated', async ({ client }) => {
  await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password: 'password',
    phone: '08909034789',
    address: 'Jl. Bandung',
  })
  const response = await client
    .post(endpoint)
    .send({email: 'test@test.com', password: 'password'})
    .end()
  response.assertStatus(400)
})

test('Cannot Login with uncomplete data', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send({email: 'test@test.com'})
    .end()
  response.assertStatus(422)
})

