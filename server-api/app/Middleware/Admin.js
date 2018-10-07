'use strict'

const { ResponseParser } = use('App/Helpers')


class Admin {
  async handle ({ auth, response }, next) {

    const user = await auth.getUser()
      console.log('current user is',user);
    if (!user) {
      return response.status(401).send(ResponseParser.unauthorizedResponse())
    }
    if (user.role_id > 2) {
      return response.status(403).send(ResponseParser.forbiddenResponse())
    }
    await next()
  }
}

module.exports = Admin
