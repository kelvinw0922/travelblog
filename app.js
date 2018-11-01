// Initial Setup
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// Passport Config
require("./config/passport")(passport);

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
