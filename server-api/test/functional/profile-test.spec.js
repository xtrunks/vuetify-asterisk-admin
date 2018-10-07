'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Profile')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = 'api/v1/profile'

/**
 * Update Profile
 */

test('Authorized can Update Own Profile', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/' + user.id)
    .loginVia(user, 'jwt')
    .send(UserData())
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      name: 'Test User',
      email: 'test@test.com',
      phone: '08909034789',
    }
  })
})

test('Authorized cannot Update Other Profile', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/3')
    .loginVia(user, 'jwt')
    .send(UserData())
    .end()
  response.assertStatus(403)
})

/**
 * Change Password
 */

test('Authorized can Change Own Password', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/' + user.id + '/change-password')
    .loginVia(user, 'jwt')
    .send({
      old_password: 'P4sw0rd@xtrunks.com',
      password: 'P4sw0rd@xtrunks.com',
      password_confirmation: 'P4sw0rd@xtrunks.com',
    })
    .end()
  response.assertStatus(200)
})

test('Cannot Change password if old password is incorrect', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/' + user.id + '/change-password')
    .loginVia(user, 'jwt')
    .send({
      old_password: 'asdfgh',
      password: 'password',
      password_confirmation: 'password',
    })
    .end()
  response.assertStatus(400)
})

test('Cannot Change password if new password les than 6 characters', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/' + user.id + '/change-password')
    .loginVia(user, 'jwt')
    .send({
      old_password: 'password',
      password: 'asd',
      password_confirmation: 'password',
    })
    .end()
  response.assertStatus(422)
})

test('Cannot Change password if not confirmed', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/' + user.id + '/change-password')
    .loginVia(user, 'jwt')
    .send({
      old_password: 'password',
      password: 'asdasd',
      password_confirmation: 'password',
    })
    .end()
  response.assertStatus(422)
})

/**
 * Form Data
 */

function UserData() {
  return {
    name: 'Test User',
    email: 'test@test.com',
    phone: '08909034789',
    address: 'Jl. Bandung',
    description: 'Bla bla bla'
  }
}
