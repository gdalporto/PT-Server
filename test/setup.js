const chai = require('chai');
const chaiHttp = require('chai-http');
global.expect = chai.expect;
chai.use(chaiHttp);

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/PT-test'; //insert test database url
process.env.JWT_SECRET = "testJWTsecret";


