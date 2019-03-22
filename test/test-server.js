'use strict';

const chai = require('chai');
const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { User } = require('../user/models');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

chai.use(chaiHttp);



const id = "5c3e28fe398c79cf64498dd4";
const username = "bob@bob.com";
const firstName = "bob";
const lastName = "bob";
const password = "Hello12345";
const email = true;



function seedData() {
    console.info('seeding user data');


    return User.hashPassword(password).then(password =>
        User.create({
            id,
            username,
            password,
            firstName,
            lastName,
            email
        })
      );
  }
  

describe('Testing Auth Endpoints - login, change, logout', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
      });
    
      beforeEach(function() {
        return seedData();
      });
    
      afterEach(function () {
        return User.remove({});
      });
        
      after(function() {
        return closeServer();
      });

    describe('test login auth/login', function(){

        it('Should return a valid auth token', function () {
            return chai
              .request(app)
              .post('/auth/login')
              .send({ username, password })
              .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                      algorithm: ['HS256']
                });
                expect(payload.user.username).to.equal(username);
                expect(payload.user.firstName).to.equal(firstName);
                expect(payload.user.lastName).to.equal(lastName);
                expect(payload.user.email).to.equal(email);
                
                });
          });
      
        it('should reject bad username', function() {
            return chai
            .request(app)
            .post('/auth/login')
            .send({username: 'incorrectUsername', password: password})
            .then((res) =>{
                expect(res.res.statusMessage).to.equal('Unauthorized');
                expect(res).to.have.status(401);
            })
        });

        it('should reject bad password', function() {
            return chai
            .request(app)
            .post('/auth/login')
            .send({username: username, password: 'badpassword'})
            .then((res) =>{
                expect(res.res.statusMessage).to.equal('Unauthorized');
                expect(res).to.have.status(401);
            })
        });

    }); 



    describe('TEST Protected endpoint /protected/user for operators GET and PUT', function(){
        let token = jwt.sign(
            {
            user: {
                username,
                firstName,
                lastName,
                email
            }
            },
            JWT_SECRET,
            {
            algorithm: 'HS256',
            subject: username,
            expiresIn: '7d'
            }
        );

        describe('TEST GET TO ENDPOINT /protected/user/', function(){
            it('Success Case: Should allow requested specific username at /protected/user', function(){
                let _id;
                return User.findOne({id:id})
                    .then(res =>{
                        _id = res.body._id;
                    })
                    .then(()=>{
                        return chai
                            .request(app)
                            .get('/protected/user/'+id)
                            .set('authorization', `Bearer ${token}`)
                            .then(res => {
                                expect(res).to.have.status(201);
                                expect(res.body.username).to.equal(username);
                                expect(res.body.firstName).to.equal(newFirstName);
                                expect(res.body.lastName).to.equal(newLastName);
                                expect(res.body.email).to.equal(newemail);
                            })    
                    })
            })

            it('Failure Case: Should NOT allow request user data if not authenticated', function(){
                let _id;
                User.findOne({id:id})
                .then(res =>{
                    _id = res.body._id;
                })
                .then(()=>{
                    return chai
                    .request(app)
                    .get('/protected/user')
                    .set('authorization', `Bearer ${token}`)
                    .set('id', id)
                    .send({'id':id})
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body.username).to.equal(username);
                        expect(res.body.firstName).to.equal(newFirstName);
                        expect(res.body.lastName).to.equal(newLastName);
                        expect(res.body.email).to.equal(newemail);
                    })    
                })

            })
                
        })


        describe('TEST MODIFYING USER at endpoint /protected/user/', function(){

            it('Success Case: Should change protected data', function () {
                
                let newFirstName = 'newFirst';
                let newLastName = 'newLast';
                let newemail=false;

                return chai
                    .request(app)
                    .put('/protected/user')
                    .set('authorization', `Bearer ${token}`)
                    .send({ 
                        username, 
                        firstName: newFirstName,
                        lastName: newLastName,
                        email: newemail
                        })
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body.username).to.equal(username);
                        expect(res.body.firstName).to.equal(newFirstName);
                        expect(res.body.lastName).to.equal(newLastName);
                        expect(res.body.email).to.equal(newemail);

                    })

            });
            it('AuthFailCase: Should not change protected data with invalid JWT', function () {
                
                let newFirstName = 'newFirst';
                let newLastName = 'newLast';
                let newemail=false;

                token = "wrongJWT";

                return chai
                    .request(app)
                    .put('/protected/user')
                    .set('authorization', `Bearer ${token}`)
                    .send({ 
                        username, 
                        firstName: newFirstName,
                        lastName: newLastName,
                        email: newemail
                        })
                    .then(res => {
                        console.log("RESPONSE IN THEN SECTION:", res.body);
                        expect(res).to.have.status(401);

                    })

            });

        });

    });

});

describe('TESTING user creation', function(){

    before(function() {
        return runServer(TEST_DATABASE_URL);
      });
        
      afterEach(function () {
        return User.remove({});
      });
        
      after(function() {
        return closeServer();
      });


    it('should register valid user', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            username,
            password,
            firstName,
            lastName,
            email
        })
        .then((res)=> {
            expect(res).to.have.status(201);
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            expect(res.body.email).to.equal(email);            
        })
      });

      it('should reject duplicate username', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            username,
            password,
            firstName,
            lastName,
            email
        })
        .then((res)=> {
            expect(res).to.have.status(201);
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            expect(res.body.email).to.equal(email);            
        })
        .then(()=>{
            return chai
            .request(app)
            .post('/user')
            .send({
                username,
                password,
                firstName,
                lastName,
                email    
            })
            .then((secondres =>{
                expect(secondres.status).to.equal(422);
    
            }))
        })
      });



      it('should reject missing username', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            password,
            firstName,
            lastName,
            email
        })
        .then((res)=> {
            expect(res.status).to.equal(422);
        })
    });
    it('should reject missing firstName', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            username,
            password,
            lastName,
            email
        })
        .then((res)=> {
            expect(res.status).to.equal(422);
        })
    });
    it('should reject missing lastName', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            username,
            password,
            lastName,
            email
        })
        .then((res)=> {
            expect(res.status).to.equal(422);
        })
    });
    it('should reject missing email status', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            username,
            password,
            firstName,
            lastName
        })
        .then((res)=> {
            expect(res.status).to.equal(422);
        })
    });
    it('should reject missing password status', function(){
        return chai
        .request(app)
        .post('/user')
        .send({
            username,
            firstName,
            lastName,
            email
        })
        .then((res)=> {
            expect(res.status).to.equal(422);
        })
    });

});

