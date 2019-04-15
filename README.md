App Name: PT
Live app: https://dashboard.heroku.com/apps/obscure-eyrie-82877

Purpose:
    Back end for public facing website for a physical therapy website.
    Manages database for users, conditions, treatments and a log of treatments and status.


API documentation:

    Create user record and opt in to receiving emails
        endpoint: 
        method: 
        required fields: 
        headers: {
            "Content-Type": "application/json",
        },

    Login:
        endpoint: /auth/login
        method: POST
        required fields
            username
            password
        headers: {
            "Content-Type": "application/json",
        },


    Retrieve user record :
        what it does: retrieves user data [id, username, firstName, lastName, email (which is a boolean value for whether user wants to be emailed with updates)] for a specific user record.
        requirement: must be authenticated
        endpoint: /protected/user
        method: GET
        headers: {
            authorization: 'Bearer [insert auth token]',
            id: [inser id],

    Update:
        what it does: updates user record with new fields
        requirement: must be authenticated
        endpoint: /protected/user
        method: POST
        required fields: 
            username: string
            firstName: string
            lastName: string
            email: boolean
        headers: {
            "Content-Type": "application/json",
            authorization: 'Bearer [insert auth key]' ,
        },


Technology used:
    back end: 
        node.js
        mongoose


{
  "dependencies": {
    "bcryptjs": "^2.4.0",
    "body-parser": "^1.15.2",
    "dotenv": "^4.0.0",
    "express": "^4.16.4",
    "jsonwebtoken": "^7.4.1",
    "mongoose": "^5.0.6",
    "morgan": "^1.9.1",
    "passport": "^0.3.2",
    "passport-jwt": "^2.2.1",
    "passport-local": "^1.0.0"
  },

  "devDependencies": {
    "chai": "^4.2.0",
    "chai-http": "^4.2.1",
    "mocha": "^5.2.0"
  },
