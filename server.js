var express      = require("express");
var app          = express();
var bodyParser   = require("body-parser");
var passport     = require("passport");
var port         = process.env.PORT || 3000;
var authenticate = require("./middleware/auth-bearer");
var mongoose     = require("mongoose");

var authRouter    = express.Router();
var selfRouter    = express.Router();
var booksRouter   = express.Router();
var transRouter   = express.Router();
var friendsRouter = express.Router();
var usersRouter   = express.Router();
var rootRouter    = express.Router();

app.use(passport.initialize());
app.use(express.static("public"));
app.use(bodyParser.json());

require("./routes/auth-routes")(authRouter);
require("./routes/self-routes")(selfRouter);
require("./routes/books-routes")(booksRouter);
require("./routes/trans-routes")(transRouter);
require("./routes/friends-routes")(friendsRouter);
require("./routes/users-routes")(usersRouter);
require("./routes/root-routes")(rootRouter);

app.use("/auth", authRouter);
app.use("/api/self", authenticate, selfRouter);
app.use("/api/books", authenticate, booksRouter);
app.use("/api/trans", authenticate, transRouter);
app.use("/api/friends", authenticate, friendsRouter);
app.use("/api/users", authenticate, usersRouter);
app.use("/", rootRouter);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/friending-library", function(err) {
  if (err) console.log(err);
  else console.log("Opened connection to MongoDB");
});

process.on("exit", function() {
  mongoose.disconnect();
});

app.listen(port, function() {
  console.log("Server running on port " + port);
});
