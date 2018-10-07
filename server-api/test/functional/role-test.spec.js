'use strict'


const Role = use('App/Models/Role')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Roles')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

/**
 * List of Role
 */

test('Unathorized cannot get Role List', async ({ client }) => {
  const response = await client
    .get('/api/v1/roles')
    .end()
  response.assertStatus(401)
})

test('Authorized can get Role List', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get('/api/v1/roles')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Create Role
 */

test('Unathorized cannot create Role', async ({ client }) => {
  const response = await client
    .post('/api/v1/roles')
    .send(roleData())
    .end()
  response.assertStatus(401)
})

test('Non Super Administrator cannot Create Role', async ({ client }) => {
  const user = await User.find(2)
  const response = await client
    .post('/api/v1/roles')
    .loginVia(user, 'jwt')
    .send(roleData())
    .end()
  response.assertStatus(403)
})

test('Super Administrator can Create Role', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .post('/api/v1/roles')
    .loginVia(user, 'jwt')
    .send(roleData())
    .end()
  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      name: 'Author',
    }
  })
})

test('Cannot Create Role with uncomplete data', async ({ client }) => {
  const role = await Role.find(1)
  const response = await client
    .post('/api/v1/roles')
    .loginVia(role, 'jwt')
    .end()
  response.assertStatus(422)
})

/**
 * Update Role
 */

test('Unathorized cannot Update Role', async ({ client }) => {
  const editing = await Role.find(2)
  const response = await client
    .put('/api/v1/roles/' + editing.id)
    .send(roleData())
    .end()
  response.assertStatus(401)
})

test('Non Superadmin cannot Update Role', async ({ client }) => {
  const user = await User.find(2)
  const editing = await Role.find(2)
  const response = await client
    .put('/api/v1/roles/' + editing.id)
    .loginVia(user, 'jwt')
    .send(roleData())
    .end()
  response.assertStatus(403)
})

test('Superadmin can Update Role', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Role.find(2)
  const response = await client
    .put('/api/v1/roles/' + editing.id)
    .loginVia(user, 'jwt')
    .send(roleData())
    .end()
  response.assertStatus(200)
})

test('Cannot Update unexisted Role', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .put('/api/v1/roles/' + 35)
    .loginVia(user, 'jwt')
    .send(roleData())
    .end()
  response.assertStatus(400)
})

/**
 * Show Role
 */

test('Unathorized cannot Show Role', async ({ client }) => {
  const role = await Role.find(2)
  const response = await client
    .get('/api/v1/roles/' + role.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Show Role', async ({ client }) => {
  const user = await User.find(1)
  const editing = await Role.find(2)
  const response = await client
    .get('/api/v1/roles/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Cannot Show unexisted Role', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .get('/api/v1/roles/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Delete Role
 */

test('Unathorized cannot Delete Role', async ({ client }) => {
  const role = await Role.find(2)
  const response = await client
    .delete('/api/v1/roles/' + role.id)
    .end()
  response.assertStatus(401)
})

test('Authorized can Delete Role', async ({ client }) => {
  const user = await User.find(1)
  const role = await Role.create({
    name: 'Author',
    slug: 'author'
  })
  const editing = await Role.find(role.id)
  const response = await client
    .delete('/api/v1/roles/' + editing.id)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('Default Role cannot be deleted', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .delete('/api/v1/roles/' + 1)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

test('Cannot Delete unexisted Role', async ({ client }) => {
  const user = await User.find(1)
  const response = await client
    .delete('/api/v1/roles/' + 35)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
})

/**
 * Get Permission by Role ID
 */
test('Unathorized cannot Show Permission by Role ID', async ({ client }) => {
  const role = await Role.find(1)
  const response = await client
    .get('/api/v1/role/' + role.id + '/permissions')
    .end()
  response.assertStatus(401)
})

test('Forbidden User cannot Show Permission by Role ID', async ({ client }) => {
  const user = await User.find(3)
  const role = await Role.find(1)
  const response = await client
    .get('/api/v1/role/' + role.id + '/permissions')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(403)
})

test('Authorized can Show Role', async ({ client }) => {
  const user = await User.find(1)
  const role = await Role.find(1)
  const response = await client
    .get('/api/v1/role/' + role.id + '/permissions')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Attach Permission into Role ID
 */

test('Attach Permission into Role', async ({ client }) => {
  const user = await User.find(1)
  let postData = {
    'role_id': 2,
    'permissions': [1,2,3,4]
  }
  const response = await client
    .put('/api/v1/role/permissions')
    .send(postData)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

/**
 * Form Data
 */

function roleData() {
  return {
    name: 'Author',
    slug: 'author',
  }
}
