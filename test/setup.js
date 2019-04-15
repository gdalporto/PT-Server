const chai = require('chai');
const chaiHttp = require('chai-http');
global.expect = chai.expect;
chai.use(chaiHttp);

// process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-mlc-app'; //insert test database url
// process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-mlc-app'; //insert test database url
process.env.JWT_SECRET = "testJWTsecret";


