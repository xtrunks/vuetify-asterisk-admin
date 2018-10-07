'use strict'

const User = use('App/Models/User')
const { ResponseParser, MailHelper } = use('App/Helpers')
const randomstring = require('randomstring')
const Hash = use('Hash')

class PasswordController {

    async postReset({ request, response }) {
        const { email, phone } = request.post()
        const user = await User.query().where('email', email).where('phone', phone).first()
        if (!user) {
            return response.status(400).send(ResponseParser.errorResponse('Unknown user'))
        }
        if (!user.is_active) {
            return response.status(400).send(ResponseParser.errorResponse('This user is not active'))
        }

        const newPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        })
        user.password = await Hash.make(newPassword)
        await user.save()
        let userData = user.toJSON()
        userData.newPassword = newPassword
        MailHelper.getForgotPassword(userData)
        return response.status(200).send(ResponseParser.successResponse(null, 'An email sent to user'))
    }
}

module.exports = PasswordController
