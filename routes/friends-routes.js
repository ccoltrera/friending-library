var User = require('../models/User');
var handle = require('../lib/handle');

module.exports = function(router) {
  router.get("/", function(req, res) {});
  router.delete("/:userid", function(req, res) {});
  router.post("/request", function(req, res) {});
  router.delete("/request/:userid", function(req, res) {});
  router.post("/approve", function(req, res) {});
  router.post("/deny", function(req, res) {});
};
