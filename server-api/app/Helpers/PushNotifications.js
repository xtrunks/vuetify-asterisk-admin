'use strict'

const admin = require('firebase-admin')

const serviceAccount = require('../../config/firebase.json')

class PushNotification {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://iocart-8868b.firebaseio.com'
    })
  }

  async sendToMobile(topic, data) {
    console.log('topic', topic) //eslint-disable-line
    console.log('data', data) //eslint-disable-line
    const message = {
      data,
      topic
    }

    // Send a message to devices subscribed to the provided topic.
    admin
      .messaging()
      .send(message)
      .then(response => {
        // Response is a message ID string.
        console.log('FCM Success Response : ', response) //eslint-disable-line
      })
      .catch(error => {
        console.log('FCM Error Response : ', error) //eslint-disable-line
      })
  }
}

module.exports = new PushNotification()
