// Initial Setup
const express = require("express");
const mongoose = require("mongoose");
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
