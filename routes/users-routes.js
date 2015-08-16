var User = require("../models/User");
var handle = require("../lib/handle");

module.exports = function(router) {
  router.get("/", function(req, res) {
    console.log("Received GET request at /api/users");
    User.find({}).exec()       // POPULATE ANY FIELDS?
      .then(function(users) {  // RESTRICT ACCESS TO FIELDS?
        res.json(users);
      }, function(err) {
        handle[500](err, res);
      });
  });
};
