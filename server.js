'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const passport = require('passport');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { User, Treatment, Condition} = require('./user/models');

const { router: usersRouter } = require('./user');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;


// START LOGGING
app.use(morgan('common'));

// User CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,id');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/user/', usersRouter);
app.use('/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });


// CHECK LOGIN STATUS


app.get('/authcheck/',jwtAuth, function(req, res){
  let status = "authenticated";
  res.status(200).json({"status": status});
});

// GET TREATMENT DATA

app.get('/treatmentdata/', function(req, res){
  Treatment.find({})
    .then(treatments=> {
      res.status(200).json({treatmentslist:treatments});
    });
});

// GET CONDITION DATA
app.get('/conditiondata/', function(req, res){
  Condition.find({})
    .then(conditions=> {
      res.status(200).json({conditionslist:conditions});
    });
});

// GET A USER AFTER AUTH CHECK

app.get("/protected/user", jwtAuth, (req, res) => {
  console.log("REQ.HEADERS.ID IS", req.headers.id);
  User.findOne({_id: req.headers.id})
    .then(user => {
        res.json({user: user.serialize()});
    });
  });


app.put("/protected/user",jwtAuth,(req,res)=>{ 
  const toUpdate = {};
  const updateableFields = ["condition"];
  updateableFields.forEach(field => {
      if(field in req.body){
        toUpdate[field] = req.body[field];
      }
  });
    User
      .update({username: req.body.username}, {$set: toUpdate})
      .then(()=>{
          return User.findOne({username: req.body.username});
      })
      .then((newUser) => {
          res.status(201).json(newUser.serialize());
      })
      .catch(err => res.status(500).json({message: "Internal server error."}));
});

app.delete('/protected/user',jwtAuth, (req,res) => {
  User.deleteOne({username: req.body.username})
    .then(resObj => {
      if(resObj.n == 0) {
        let message = "Error no record found to delete";
        return res.status(500).json({message:message});
      }
      res.status(202).json({message:`Successfully deleted ${resObj.n} record(s)`});
    })
    .catch(err => res.status(500).json({message: "Internal server error"}));
});


// MANAGE THE SERVER

let server;

// connect database then start server
function runServer(dbURL = DATABASE_URL,  port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbURL, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port,()=>{
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    })
  });
};



// disconnect db and close server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve,reject)=>{
      console.log("Closing server");
        server.close(err => {
          if(err){
            return reject(err);
          }
          resolve();
        });
    });
  });
};


// auto run server if called directly by npm start.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  };

// export server so test code can start as needed.
module.exports = { app, runServer, closeServer };



//---------------------------------------------------------

