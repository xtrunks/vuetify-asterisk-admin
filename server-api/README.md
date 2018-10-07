# Adonis Vuetify Asterisk Admin Rest API 

This is the server part of the Vuetify Adonis Asterisk Admin.
We connet to asterisk ARI using websockets and listen for events in  
case we receive an event then we look into database for a related TWIML
if found then the whole TWIML plan will be executed. The administration area
is seperate from this rest admin so you can have your own designer studio for 
TWIML connected to this rest admin and use it just for server side operations. 


1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds
6. User permissions
7. firebase push notifications
8. JWT Auth
9. WebSockets
## Setup

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run --seed

```
Vuetify Asterisk ARI Admin is NOT FREE for commercial using in any form modified or as it is. Please find more about licensing the product [here](https://xtrunks.com/Licenses) 
