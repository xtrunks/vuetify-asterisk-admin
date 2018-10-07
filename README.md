# Adonis Vuetify Asterisk ARI Admin using rest API

The purpose of this project is to make full use of Asterisk Rest Interface (ARI) and make it interact with TWIML based config loadable at runtime using Redis and a simple web based interface in Vuetify where these number to TWIML config can be added.

1. Complete user group permission management system
2. User can add his Inbound and Outbound SIP servers
3. User can define a Callee or Caller based TWIML rules
4. TWIML rules can either be added manually here or you can use Twilio Studio to create them and import here or can provide a URL to load rules with custom headers to be sent with the URL and select the method to be used to fetch the TWIML rules
5. All the rules when added/updated/deleted to the database are also loaded/updated/deleted into redis.
6. Websockets server and ARI client both use redis to load the TWIML from redis    


Vuetify Asterisk ARI Admin is NOT FREE for commercial using in any form modified or as it is. Please find more about licensing the product [here](https://xtrunks.com/Licenses) 
