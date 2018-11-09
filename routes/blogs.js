const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const mongoose = require("mongoose");

// Load Blog and User Model
const Blog = mongoose.model("blogs");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  // Display only public blogs, not private
  Blog.find({ status: "public" })
    .populate("user") // Populate the user's field
    .then(blogs => {
      res.render("blogs/index", {
        blogs: blogs
      });
    });
});

// Add Blog Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("blogs/add");
});

// Edit Blog Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.params.id
  }).then(blog => {
    res.render("blogs/edit", {
      blog: blog
    });
  });
});

// Show Single Blog
router.get("/show/:id", (req, res) => {
  Blog.findOne({
    _id: req.params.id
  })
    .populate("user")
    .then(blog => {
      res.render("blogs/show", {
        blog: blog
      });
    });
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
