'use strict'

const { RedisHelper, ResponseParser } = use('App/Helpers')
const { ActivityTraits } = use('App/Traits')
const Hash = use('Hash')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const Env = use('Env')

class ProfileController {

    async me({response, auth}) {
        const data = await auth.getUser()
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        await data.load('roles')
        let parsed = ResponseParser.apiItem(data.toJSON())
        return response.status(200).send(parsed)
    }
    /**
     * Profile Update
     * @param {any} user data
     * @returns user collection
     */
    async update({ request, response, auth }) {
        const data = await auth.getUser()
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        let body = request.only(['name', 'email', 'phone', 'address', 'description'])
        await data.merge(body)
        await data.save()
        await data.load('roles')
        const activity = 'Update Profile'
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('User_*')
        }

        let parsed = ResponseParser.apiUpdated(data.toJSON())
        return response.status(200).send(parsed)
    }

    /**
     * Change Password
     * @param {string} old_password
     * @param {string} password
     * @param {string} password_confirmation
     * @returns User data
     */

    async changePassword({ request, response, auth }) {
        const { id } = request.params
        if(id != auth.user.id) {
            return response.status(403).send(ResponseParser.forbiddenResponse())
        }

        const data = await User.find(id)
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        const { old_password, password } = request.post()
        const isSame = await Hash.verify(old_password, data.password)
        if (!isSame) {
            return response
                .status(400)
                .send(ResponseParser.errorResponse('Old password incorect'))
        }
        const hashPassword = await Hash.make(password)
        await data.merge({ password: hashPassword })
        await data.save()
        return response
            .status(200)
            .send(ResponseParser.successResponse(data, 'Password updated'))
    }

    /**
     * @param {file} photo
     * @returns User data
     */

    async uploadPhoto({ request, response, auth }) {
        const data = await auth.getUser()
        if (!data) {
            return response.status(400).send(ResponseParser.apiNotFound())
        }
        const photo = request.file('photo', {
            types: ['image'],
            size: '5mb'
        })

        if (!photo) {
            return response.status(400).send(ResponseParser.errorResponse('Photo is not an image file'))
        }
        const name = `${new Date().getTime()}.${photo.subtype}`

        await photo.move(Helpers.publicPath('img/users'), { name })

        if (!photo.moved()) {
            return response.status(400).send(ResponseParser.errorResponse('Photo failed to upload'))
        }
        await data.merge({ photo: `/img/users/${name}` })
        await data.save()
        await data.load('roles')
        const activity = 'Update profile photo'
        await ActivityTraits.saveActivity(request, auth, activity)

        if(Env.get('REDIS_ENABLED',false)) {
            await RedisHelper.delete('User_*')
        }
        let parsed = ResponseParser.apiUpdated(data.toJSON())
        return response.status(200).send(parsed)
    }
}

module.exports = ProfileController
