'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { response }) {
    if (error.name === 'InvalidJwtToken') {
      console.log('InvalidJwtToken') //eslint-disable-line
      return response.status(401).send({
        meta: {
          status: 401,
          message: 'Unathorized'
        }
      })
    }

    if (error.name === 'ExpiredJwtToken') {
      console.log('ExpiredJwtToken') //eslint-disable-line
      return response.status(401).send({
        meta: {
          status: 401,
          message: 'Expired token'
        }
      })
    }

    if (error.name === 'HttpException') {
      return response.status(404).send({
        meta: {
          status: 404,
          message: 'Route not found'
        }
      })
    }

    if (error.name === 'ForbiddenException') {
      return response.status(403).send({
        meta: {
          status: 403,
          message: 'Forbidden'
        }
      })
    }

    return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // async report (error, { request }) {
  // }
}

module.exports = ExceptionHandler
