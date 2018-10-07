'use strict'

const Mail = use('Mail')

const Env = use('Env')

const from = Env.get('MAIL_FROM')

class MailHelper {
  async getForgotPassword(user) {
    await Mail.send('emails.forgot_password', user, (message) => {
      message
        .to(user.email)
        .from(from)
        .subject('Forgot Password Request')
    })
  }

  async sendEveryMinutes(user) {
    await Mail.send('emails.every_minutes', user, (message) => {
      message
        .to(user.email)
        .from(from)
        .subject('Every Minutes Mail')
    })
  }
}

module.exports = new MailHelper()
