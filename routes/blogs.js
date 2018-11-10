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
    .sort({ date: "desc" })
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
    // Check if the logged in user is the blog's user
    if (blog.user != req.user.id) {
      res.redirect("/blogs");
    } else {
      res.render("blogs/edit", {
        blog: blog
      });
    }
  });
});

// Show Single Blog
router.get("/show/:id", (req, res) => {
  let previousPage = req.header("Referer") || "/";
  Blog.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(blog => {
      res.render("blogs/show", {
        blog: blog,
        previousPage: previousPage
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

// Process Edit Blogs (PUT)
router.put("/:id", (req, res) => {
  //res.send("put");
  Blog.findOne({
    _id: req.params.id
  }).then(blog => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    blog.title = req.body.title;
    blog.body = req.body.body;
    blog.status = req.body.status;
    blog.allowComments = allowComments;

    blog.save().then(blog => {
      res.redirect("/dashboard");
    });
  });
});

// Process Delete Blogs (DELETE)
router.delete("/:id", (req, res) => {
  Blog.findByIdAndDelete({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

// Add Comment
router.post("/comment/:id", (req, res) => {
  Blog.findById({
    _id: req.params.id
  }).then(blog => {
    // Create a new comment object
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add the comment object to the comment array in a Blog object
    blog.comments.unshift(newComment);

    // Save
    blog.save().then(blog => {
      res.redirect(`/blogs/show/${blog.id}`);
    });
  });
});

module.exports = router;
