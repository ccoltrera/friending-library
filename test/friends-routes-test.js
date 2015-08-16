/* jshint expr: true */

var chai     = require('chai');
var expect   = chai.expect;
var _        = require('lodash');
var port     = process.env.PORT || 3000;
var url      = "localhost:" + port;
var app      = require('../server');
var User     = require('../models/User');
var Book     = require('../models/Book');
var testData = require('../lib/test-data');

chai.use(require('chai-http'));

beforeEach(function() {
  var testBooks = _.cloneDeep(testData.books);
  var testUsers = _.cloneDeep(testData.users);
});

describe('/api/friends GET', function() {
  it('should return a JSON array of the user\'s friends');
});

describe('/api/friends/:userid DELETE', function() {
  it('should (if the user is not currently borrowing any books from the friend) remove the friend from the user\'s friends array, remove the user from the friend\'s friends array, and return a JSON success message');
});

describe('/api/friends/request POST', function() {
  it('should add the user to the potential friend\'s "fr_requests_in" array, add the potential friend to the user\'s "fr_requests_out" array, and return a JSON success message');
});

describe('/api/friends/request/:userid DELETE', function() {
  it('should remove the user from the would-be friend\'s "fr_requests_in" array, remove the would-be friend from the user\'s "fr_requests_out" array, and return a JSON success message');
});

describe('/api/friends/approve POST', function() {
  it('should add the friend to the user\'s "friends" array, remove the friend from the user\'s "fr_requests_in" array, add the user to the friend\'s "friends" array, remove the user from the friend\'s "fr_requests_out" array, and return a JSON success message');
});

describe('/api/friends/deny POST', function() {
  it('should remove the user from the would-be friend\'s "fr_requests_out" array, remove the would-be friend from the user\'s "fr_requests_in" array, and return a JSON success message');
});
