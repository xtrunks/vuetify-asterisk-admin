'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')

/**
 * Login Method
 * @param {string} email
 * @param {string} password
 * @return token, user data
 */

class LoginController {
    async login({ request, response, auth }) {
        try {
            const { email, password } = request.post()
            // Check user
            const user = await User.findBy('email', email)
            if (!await this.checkUser(user, email, password)) {
                return response.status(400).send(this.errorResponse())
            }
            await user.tokens().delete()
            const data = await auth.withRefreshToken().attempt(email, password)
            // Include user data into token data
            await user.load('roles')
            data.user = user
            return response.status(200).send(this.successResponse(data))
        } catch (e) {
            console.log(e) //eslint-disable-line
            return response.status(400).send(this.errorResponse())
        }
    }

    /**
     * Fefresh token
     * @param {string} token
     * @return token, user data
     */

    async refresh({ request, response, auth }) {
        try {
            const user = await auth.getUser()
            const data = await auth
                .newRefreshToken()
                .generateForRefreshToken(request.input('refreshToken'))
            await user.load('roles')
            data.user = user
            return response.status(200).send(this.successResponse(data))
        } catch (e) {
            console.log('e', e) //eslint-disable-line
            return response.status(401).send(this.unauthorizedResponse())
        }
    }

    /**
     * Check user status
     */

    async checkUser(user, email, password) {
        if (!user) {
            console.log('no user') //eslint-disable-line
            return false
        }
        if (!await Hash.verify(password, user.password)) {
            console.log('password not matched') //eslint-disable-line
            return false
        }
        if (!user.is_active) {
            console.log('user not active') //eslint-disable-line
            return false
        }
        return true
    }

    /**
     * Error Response
     */

    errorResponse() {
        return {
            meta: {
                status: 400,
                message: 'Login Failed'
            }
        }
    }

    /**
     * Unauthorized
     */

    unauthorizedResponse() {
        return {
            meta: {
                status: 401,
                message: 'Unathorized'
            }
        }
    }

    /**
     * Success Response
     */

    successResponse(data) {
        return {
            meta: {
                status: 200,
                message: 'Login successfully'
            },
            data
        }
    }
}

module.exports = LoginController
