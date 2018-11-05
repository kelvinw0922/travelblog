// Initial Setup
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

// Load Keys
const keys = require("./config/keys");

// Load User Model
require("./model/User");

// Map Global Promises - Mongoose
mongoose.Promise = global.Promise;

// Passport Config
require("./config/passport")(passport);

// Mongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Use ExpressJS
const app = express();

// Load Routes
const auth = require("./routes/auth");

// CookieParser Middleware
app.use(cookieParser());

// Express-Session Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Route
app.get("/", (req, res) => {
  res.send("It Works");
});

app.use("/auth", auth);

// Dynamic Port#, either develop port or localhost 5000
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
