var Book = require("../models/Book");
var User = require("../models/User");
var handle = require("../lib/handle");

module.exports = function(router) {

  router.post("/", function(req, res) {
    console.log("Received POST request at /api/books");
    var user = req.user;
    var book = req.body;
    var output;           // Book document to create and return
    book.owner = user._id;

    Book.create(book)
      .then(function(bookDoc) {
        output = bookDoc;
        return User.findByIdAndUpdate(user._id, {$push: {books: bookDoc._id}})
          .exec();
      }, function(err) {
        throw err;
      })
      .then(function(userDoc) {
        res.json(output);
      }, function(err) {
        handle[500](err, res);
      });
  });

  router.delete("/:bookid", function(req, res) {
    var userId = req.user._id;
    var bookId = req.params.bookid;
    // store record of deleted book to return
    var output;
    console.log("Received DELETE request at /api/books/" + bookId);
    Book.findById(bookId).exec()
      .then(function(bookDoc) {
        output = bookDoc;
        return bookDoc.delete(); // call instance method
      })
      .then(function() {
        res.json(output);
      }, function(err) {
        handle[500](err, res);
      });
  });

  router.get("/available", function(req, res) {
    console.log("Received GET request at /api/books/available");
    // find friends' books that aren't currently requested or borrowed and don't belong to the current user
    var friendsIds;
    User.findById(req.user._id).exec()
      .then(function(userDoc) {
        // will throw ReferenceError if no doc return (handled on next 'then')
        friendsIds = userDoc.friends;
        return Book.find(
          {
            owner: {$in: friendsIds}, request: "", borrower: ""
          })
          .populate("owner")
          .exec();
      })
      .then(function(books) {
        res.json(books);
      }, function(err) {
        handle[500](err, res);
      });
  });
};
