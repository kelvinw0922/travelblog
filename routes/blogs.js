const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const mongoose = require("mongoose");

// Load Blog and User Model
const Blog = mongoose.model("blogs");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  res.render("blogs/index");
});

// Add Blog Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("blogs/add");
});

// Private Stories
router.get("/my", ensureAuthenticated, (req, res) => {
  res.render("blogs/show");
});

// Process Add Blogs (POST)
router.post("/", (req, res) => {
  // console.log(req.body);
  // console.log(req.user);
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newBlog = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };

  // Creat Blog
  new Blog(newBlog).save().then(blog => {
    res.redirect(`/blogs/show/${blog.id}`);
  });
});

module.exports = router;
