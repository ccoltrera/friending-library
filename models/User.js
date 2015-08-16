var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");
var deepPopulate = require('mongoose-deep-populate');

mongoose.Promise = require("bluebird");

var userSchema = new mongoose.Schema({
  _id: String,
  displayName: String,
  access_token: String,
  books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
  borrowing: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
  requests: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
  friends: [{type: String, ref: "User"}],
  fr_requests_in: [{type: String, ref: "User"}],
  fr_requests_out: [{type: String, ref: "User"}]
});

userSchema.plugin(findOrCreate);
userSchema.plugin(deepPopulate);

var User = mongoose.model("User", userSchema);

module.exports = User;
