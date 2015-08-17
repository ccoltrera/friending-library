var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate');

mongoose.Promise = require('bluebird');

var bookSchema = new mongoose.Schema({
  owner: {type: String, ref: "User", index: true},
  request: {type: String, ref: "User", default: ""}, // ONLY ALLOW ONE REQUEST
  borrower: {type: String, ref: "User", default: ""},
  dateBorrowed: Date,
  title: {type: String, required: true},
  subtitle: String,
  authors: [{type: String, required: true}],
  publisher: String,
  publishedDate: String,
  description: String,
  ISBN: {
    10: String,
    13: String
  },
  pageCount: Number,
  categories: [String],
  language: String,
  imageLinks: {
    smallThumbnail: String,
    thumbnail: String,
    small: String
  }
});

bookSchema.methods.delete = function() {
  var User = mongoose.model('User');
  // remove the book
  return Book.findByIdAndRemove(this._id).exec()
    // remove from owner.books
    .then(function() {
      return User.findByIdAndUpdate(this.owner,
        {
          $pull: {books: this._id}
        })
        .exec();
    })
    // remove from borrower.borrowing
    .then(function() {
      if (this.borrower) {
        return User.findByIdAndUpdate(this.borrower,
          {
            $pull: {borrowing: this._id}
          })
          .exec();
      } else return;
    })
    // remove from 'requests'
    .then(function() {
      if (this.request) {
        return User.findByIdAndUpdate(this.request,
          {
            $pull: {requests: this._id}
          })
          .exec();
      } else return;
    });
};

bookSchema.plugin(deepPopulate);

var Book = mongoose.model("Book", bookSchema);

module.exports = Book;
