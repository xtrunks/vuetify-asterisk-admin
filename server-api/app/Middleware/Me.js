'use strict'

const { ResponseParser } = use('App/Helpers')

class Me {
  async handle ({ request, auth, response }, next) {
    const user =  await auth.getUser()
    if(!user) {
      return response.status(401).send(ResponseParser.unauthorizedResponse())
    }
    const id = request.params.id
    if(id != user.id) {
      return response.status(403).send(ResponseParser.forbiddenResponse())
    }
    await next()
  }
}

module.exports = Me
