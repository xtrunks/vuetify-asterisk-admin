'use strict'

const Route = use('Route')
const { RedisHelper, ResponseParser } = use('App/Helpers')

Route.get('/docs', 'DocumentController.index')
Route.get('/', 'DocumentController.intro')

Route
  .group(() => {
    Route.post('/login', 'LoginController.login').validator('Login')
    Route.post('/refresh', 'LoginController.refresh').middleware(['auth:jwt'])
    Route.post('/reset', 'PasswordController.postReset').validator('Auth/GetForgot')

  })
  .prefix('api/v1')
  .namespace('Auth')
  .formats(['json'])

/**
 * Auth:jwt Route
 */

Route
  .group(() => {

    /**
     * Redis
     */

    Route.get('redis/clear', async ({ response }) => {
      await RedisHelper.clear()
      return response.status(200).send(ResponseParser.successResponse('Redis Clear'))
    }).middleware(['can:clear_redis'])

    /**
   * Dashboard
   */

    Route.get('dashboard-data', 'DashboardController.index')
    Route.post('dashboard-data', 'DashboardController.store')

    /**
     * Activities
     */
    Route.get('activities', 'ActivityController.index')

    /**
     * Users
     */
    Route
      .resource('users', 'UserController')
      .apiOnly()
      .validator(new Map([
        [['users.store'], ['User']],
        [['users.update'], ['UserUpdate']],
        [['users.index'], ['List']]
      ]))
      .middleware(new Map([
        [['users.index'], ['can:read_user']],
        [['users.store'], ['can:create_user']],
        [['users.update'], ['can:update_user']],
        [['users.destroy'], ['can:delete_user']]
      ]))

    /**
     * Roles
     */
    Route
      .resource('roles', 'RoleController')
      .apiOnly()
      .validator(new Map([
        [['roles.store'], ['Role']],
        [['roles.update'], ['Role']]
      ]))
      .middleware(new Map([
        [['roles.index'], ['can:read_role']],
        [['roles.store'], ['can:create_role']],
        [['roles.update'], ['can:update_role']],
        [['roles.destroy'], ['can:delete_role']]
      ]))

    Route.get('/role/:id/permissions', 'RoleController.getPermissions').middleware('can:read_role')
    Route.put('/role/permissions', 'RoleController.attachPermissions')
      .validator('AttachPermissions')
      .middleware('can:create_role')

    /**
     * Roles
     */
    Route
      .resource('permissions', 'PermissionController')
      .apiOnly()
      .validator(new Map([
        [['permissions.store'], ['StorePermission']],
        [['permissions.update'], ['UpdatePermission']]
      ]))
      .middleware(new Map([
        [['permissions.index'], ['can:read_permission']],
        [['permissions.store'], ['can:create_permission']],
        [['permissions.update'], ['can:update_permission']],
        [['permissions.destroy'], ['can:delete_permission']]
      ]))



    /**
     * Companies
     */

    Route
      .resource('companies', 'CompanyController')
      .apiOnly()
      .validator(new Map([
        [['companies.store'], ['StoreCompany']],
        [['companies.update'], ['UpdateCompany']],
        [['companies.index'], ['List']]
      ]))
      .middleware(new Map([
        [['companies.index'], ['can:read_company']],
        [['companies.store'], ['can:create_company']],
        [['companies.update'], ['can:update_company']],
        [['companies.destroy'], ['can:delete_company']]
      ]))

    /**
     * For Combo Box / Select Box
     */
    Route.get('combo-data', 'ComboDataController.index')

    /**
     * Export Data
     */

    Route.get('export-data', 'DataExportController.index').validator('ExportData')

    /**
     * Me
     */
    Route.get('me', 'ProfileController.me')

  })
  .prefix('api/v1')
  .formats(['json'])
  .middleware(['auth:jwt'])

/**
 * Auth:jwt, me Routes
 */

Route
  .group(() => {
    Route.put('profile/:id', 'ProfileController.update').validator('ProfileUpdate')
    Route.put('profile/:id/change-password', 'ProfileController.changePassword').validator('ChangePassword')
    Route.post('profile/upload/:id', 'ProfileController.uploadPhoto')

  })
  .prefix('api/v1')
  .formats(['json'])
  .middleware(['auth:jwt', 'me'])