'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  console.log("In Create Auth Token user", user);
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
  let serializedUser = {
    id: req.user.id,
    username: req.user.username,
    condition: req.user.condition,
    treatments: req.user.treatments,
    log: req.user.log
  }

//  const authToken = createAuthToken(req.user.serialize());
// const authToken = createAuthToken(req.user);
const authToken = createAuthToken(serializedUser);
res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh/newpayload', jwtAuth, (req, res) => {
  console.log("REQ.USER IS",req.user);
  const authToken = createAuthToken(req.body);
  res.json({authToken});
});


module.exports = {router};
