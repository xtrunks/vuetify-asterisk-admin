'use strict'


const Permission = use('App/Models/Permission')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Permissions')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const endpoint = '/api/v1/permissions'

/**
 * List of Permission
 */

test('Unathorized cannot get Permission List', async ({ client }) => {
  const response = await client
    .get(endpoint)
    .end()
  response.assertStatus(401)
})

test('Authorized can get Permission List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Permission
 */

test('Unathorized cannot create Permission', async ({ client }) => {
  const response = await client
    .post(endpoint)
    .send(PermissionData())
    .end()
  response.assertStatus(401)
})

test('Non Super Administrator cannot Create Permission', async ({ client }) => {
  const user = await User.find(3)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(PermissionData())
    .end()
  response.assertStatus(403)
})

test('Super Administrator can Create Permission', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .send(PermissionData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      name: 'Create Author',
      slug: 'create_author',
    }
  })
})

test('Cannot Create Permission with uncomplete data', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post(endpoint)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Permission
 */

test('Unathorized cannot Update Permission', async ({ client }) => {
  const editing = await Permission.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .send(PermissionData())
    .end()
  response.assertStatus(401)
})

test('Non Superadmin cannot Update Permission', async ({ client }) => {
  const user = await User.find(2)
  const editing = await Permission.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(PermissionData())
    .end()
  response.assertStatus(403)
})

test('Superadmin can Update Permission', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Permission.find(2)
  const response = await client
    .put(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .send(PermissionData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted Permission', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put(endpoint + '/' + 2500)
    .loginVia(user, 'jwt')
    .send(PermissionData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Permission
 */

test('Unathorized cannot Show Permission', async ({ client }) => {
  const permission = await Permission.find(4)
  const response = await client
    .get(endpoint + '/' + permission.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Permission', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Permission.find(2)
  const response = await client
    .get(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Permission', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get(endpoint + '/' + 2500)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Permission
 */

test('Unathorized cannot Delete Permission', async ({ client }) => {
  const edit = await Permission.find(4)
  const response = await client
    .delete(endpoint + '/' + edit.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Permission', async ({ client }) => {
  const user = await User.find(1)
  const data = await Permission.create({
    name: 'Author',
    slug: 'author'
  })
  const editing = await Permission.find(data.id)
  const response = await client
    .delete(endpoint + '/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Delete unexisted Permission', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .delete(endpoint + '/' + 2500)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Form Data
 */

function PermissionData() {
  return {
    name: 'Create Author',
    slug: 'create_author',
  }
}
