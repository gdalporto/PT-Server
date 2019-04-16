const chai = require('chai');
const chaiHttp = require('chai-http');
global.expect = chai.expect;
chai.use(chaiHttp);

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://dalporto:Hello12345@ds239936.mlab.com:39936/pt-database-test' || 'mongodb://localhost/PT-test'; //insert test database url
process.env.JWT_SECRET = "testJWTsecret";


