var User = require('../models/User');
var handle = require('../lib/handle');

module.exports = function(router) {

  router.get("/", function(req, res) {
    User.findById(req.user._id)
      .populate("friends")     // POPULATE ANY OTHER FIELDS?
      .exec()                  // RESTRICT ACCESS TO CERTAIN FIELDS?
      .then(function(user) {
        res.json(user.friends);
      }, function(err) {
        handle[500](err, res);
      });
  });

  router.delete("/:userid", function(req, res) {
    var userid = req.user._id;
    var friendId = req.params.userid;
    User.findById(userid)
      .deepPopulate("borrowing.owner")
      .exec()
      .then(function(userDoc) {
        for (var i = 0; i < userDoc.borrowing.length; i++) {
          if (userDoc.borrowing[i].owner._id === friendId) {
            var err = new Error("Cannot remove friend until book is returned");
            err.code = 403;
            throw err;
          }
        }
      })
      .then(function() {
        return findByIdAndUpdate(userid,
          {
            $pull: {friends: friendId}
          })
          .exec();
      })
      .then(function() {
        return findByIdAndUpdate(friendId,
          {
            $pull: {friends: userid}
          })
          .exec();
      })
      .then(function() {
        res.json({msg: "Deleted friend"});
      }, function(err) {
        if (err.code === 403) handle[403](err, res);
        else handle[500](err, res);
      });
  });

  router.post("/request", function(req, res) {
    var userid = req.user._id;
    var potentialFriendId = req.body._id;       // ENTIRE BODY OR JUST ._id?
    User.findByIdAndUpdate(potentialFriendId,
      {
        $push: {friend_requests_in: userid}
      })
      .exec()
      .then(function(potentialFriendDoc) {
        if (!potentialFriendDoc) {
          var err = new Error("Cannot find user " + potentialFriendId);
          err.code = 404;
        }
        else return User.findByIdAndUpdate(userid,
          {$push:
            {friend_requests_out: potentialFriendId}
          })
          .exec();
      })
      .then(function() {
        res.json({msg: "Friend request sent"});  // WHAT DO WE RETURN?
      }, function(err) {
        if (err.code === 404) handle[404](err, res);
        else handle[500](err, res);
      });
  });

  router.delete("/request/:userid", function(req, res) {
    var userid = req.user._id;
    var wouldBeFriendId = req.params.userid;
    User.findByIdAndUpdate(userid,
      {
        $pull: {friend_requests_out: wouldBeFriendId}
      })
      .exec()
      .then(function() {
        return User.findByIdAndUpdate(wouldBeFriendId,
          {
            $pull: {friend_requests_in: userid}
          })
          .exec();
      })
      .then(function() {
        res.json({msg: "Friend request deleted"});  // WHAT DO WE RETURN?
      }, function(err) {
        handle[500](err, res);
      });
  });

  router.post("/approve", function(req, res) {
    var userid = req.user._id;
    var newFriendId = req.body._id; // ENTIRE BODY OR JUST ._id?
    User.findByIdAndUpdate(userid,
      {
        $push: {friends: newFriendId},
        $pull: {friend_requests_in: newFriendId}
      })
      .exec()
      .then(function(newFriendDoc) {
        return User.findByIdAndUpdate(newFriendId,
          {
            $push: {friends: userid},
            $pull: {friend_requests_out: userid}
          })
          .exec();
      })
      .then(function() {
        res.json({msg: "Friend added"});
      }, function(err) {
        handle[500](err, res);
      });
  });

  router.post("/deny", function(req, res) {
    var userid = req.user._id;
    var wouldBeFriendId = req.body._id; // ENTIRE BODY OR JUST ._id?
    User.findByIdAndUpdate(userid,
      {
        $pull: {friend_requests_in: wouldBeFriendId}
      })
      .exec()
      .then(function() {
        return User.findByIdAndUpdate(wouldBeFriendId,
          {
            $pull: {friend_requests_out: userid}
          })
          .exec();
      })
      .then(function() {
        res.json({msg: "Friend request denied"});  // WHAT DO WE RETURN?
      }, function(err) {
        handle[500](err, res);
      });
  });
};
