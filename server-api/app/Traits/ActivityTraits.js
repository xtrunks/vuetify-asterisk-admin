'use strict'

const Activity = use('App/Models/Activity')

class ActivityTraits {
  async saveActivity(request, auth, activity) {
    const headers = request.headers()
    const user = await auth.getUser()
    await Activity.create({
      user_id: user.id,
      ip: request.ip(),
      browser: headers['user-agent'],
      activity
    })
    return true
  }
}

module.exports = new ActivityTraits()
