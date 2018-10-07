'use strict'

const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = '/api/v1/combo-data?model='


/**
 * List of Company Combo Data
 */

test('Company Combo Data List', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get(endpoint + 'Company')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * List of Permission Combo Data
 */

test('Permission Combo Data List', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get(endpoint + 'Permission')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})
