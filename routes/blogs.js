const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Set up Multer
var storage = multer.memoryStorage();

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname.toLowerCase());
    if (ext !== ".png") {
      return callback(null, false);
    }
    callback(null, true);
  }
}).single("coverImage");

// Load Blog and User Model
const Blog = mongoose.model("blogs");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  // Display only public blogs, not private
  Blog.find({ status: "public" })
    .populate("user") // Populate the user's field
    .populate("scoreStatus.voteUser")
    .sort({ date: "desc" })
    .then(blogs => {
      res.render("blogs/index", {
        blogs: blogs,
        voting: true
      });
    });
});

// List all blogs from a user
router.get("/user/:userId", (req, res) => {
  Blog.find({ user: req.params.userId, status: "public" })
    .populate("user")
    .then(blogs => {
      res.render("blogs/index", {
        blogs: blogs,
        voting: true
      });
    });
});

//Private Stories
router.get("/my", ensureAuthenticated, (req, res) => {
  Blog.find({ user: req.user.id })
    .populate("user")
    .then(blogs => {
      res.render("blogs/index", {
        blogs: blogs,
        voting: false
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
  let previousPage = "/blogs";
  Blog.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(blog => {
      if (blog.status == "public") {
        res.render("blogs/show", {
          blog: blog,
          previousPage: previousPage
        });
      } else {
        if (req.user) {
          if (req.user.id == blog.user._id) {
            res.render("blogs/show", {
              blog: blog,
              previousPage: previousPage
            });
          } else {
            res.redirect("/blogs");
          }
        } else {
          res.redirect("/blogs");
        }
      }
      // res.render("blogs/show", {
      //   blog: blog,
      //   previousPage: previousPage
      // });
    });
});

// Process Add Blogs (POST)
router.post("/", upload, (req, res) => {
  // console.log(req.body);
  // console.log(req.user);
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  let coverImage_data, coverImage_contentType;
  coverImage_contentType = "image/png";
  let newBlog;

  // Check if user has uploaded coverImage
  if (req.file) {
    coverImage_data = req.file.buffer;
    const newCoverImage = {
      data: coverImage_data,
      contentType: coverImage_contentType
    };
    newBlog = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments: allowComments,
      user: req.user.id,
      coverImage: newCoverImage
    };
  } else {
    newBlog = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments: allowComments,
      user: req.user.id
    };
  }

  // Creat Blog
  new Blog(newBlog).save().then(blog => {
    res.redirect(`/blogs/show/${blog.id}`);
  });
});

// Process Edit Blogs (PUT)
router.put("/:id", ensureAuthenticated, (req, res) => {
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
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Blog.findByIdAndDelete({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

// Add Comment - POST request
router.post("/comment/:id", ensureAuthenticated, (req, res) => {
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

// Get Comment - GET request
router.get("/comment/:id", (req, res) => {
  // res.send(req.params.id);
  Blog.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(blog => {
      // Comments
      if (
        parseInt(req.query.commentIndex) -
          1 +
          parseInt(req.query.commentLimit) >=
        blog.comments.length
      ) {
        var comments = blog.comments.slice(
          parseInt(req.query.commentIndex) - 1,
          parseInt(req.query.commentIndex) - 1 + blog.comments.length
        );
        var commentPayload = { comments: comments, theEnd: true };
        res.send(commentPayload);
      } else {
        var comments = blog.comments.slice(
          parseInt(req.query.commentIndex) - 1,
          parseInt(req.query.commentIndex) -
            1 +
            parseInt(req.query.commentLimit)
        );
        var commentPayload = { comments: comments, theEnd: false };
        res.send(commentPayload);
      }
    });
});

// Karma - Upvote
router.get("/upvote", ensureAuthenticated, (req, res) => {
  // const val = req.query.blogid;
  // console.log(`In get, ${val}`);
  // res.send("Got upvote");
  Blog.findOne({
    _id: req.query.blogid,
    scoreStatus: { $elemMatch: { voteUser: req.user.id } }
  }).then(blog => {
    // User has not voted the story yet
    if (!blog) {
      // Find the story
      Blog.findById({
        _id: req.query.blogid
      }).then(blog => {
        // The user will upvote the story
        const newScoreStatus = { voteUser: req.user.id, vote: "upvote" };
        blog.score += 1;
        blog.scoreStatus.unshift(newScoreStatus);
        blog.save().then(blog => {
          res.send({ newScore: blog.score, colored: true });
        });
      });
    }
    // User has voted the story before
    else {
      // Check if user has upvoted or downvoted the story
      for (var i = 0; i < blog.scoreStatus.length; i++) {
        if (blog.scoreStatus[i].voteUser == req.user.id) {
          // If upvoted
          if (blog.scoreStatus[i].vote == "upvote") {
            // Removed scoreStatus for the user
            Blog.updateOne(
              { _id: req.query.blogid },
              {
                $pull: {
                  scoreStatus: { voteUser: req.user.id }
                }
              },
              { safe: true, multi: true }
            ).then(result => {});
            // Take off the score for the user
            blog.score -= 1;
            blog.save().then(blog => {
              res.send({ newScore: blog.score, colored: false });
            });
            break;
          }
          // If downvoted
          else {
            // Take off the score for the user and upvote
            blog.score += 2;
            // Set vote to upvote
            blog.scoreStatus[i].vote = "upvote";
            blog.save().then(blog => {
              res.send({ newScore: blog.score, colored: true });
            });
            break;
          }
        }
      }
    }
  });
});

// Karma - Downvote
router.get("/downvote", ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.query.blogid,
    scoreStatus: { $elemMatch: { voteUser: req.user.id } }
  }).then(blog => {
    // User has not voted the story yet
    if (!blog) {
      // Find the story
      Blog.findById({
        _id: req.query.blogid
      }).then(blog => {
        // The user will downvote the story
        const newScoreStatus = { voteUser: req.user.id, vote: "downvote" };
        blog.score -= 1;
        blog.scoreStatus.unshift(newScoreStatus);
        blog.save().then(blog => {
          res.send({ newScore: blog.score, colored: true });
        });
      });
    }
    // User has voted the story before
    else {
      // Check if user has upvoted or downvoted the story
      for (var i = 0; i < blog.scoreStatus.length; i++) {
        if (blog.scoreStatus[i].voteUser == req.user.id) {
          // If downvoted
          if (blog.scoreStatus[i].vote == "downvote") {
            // Removed scoreStatus for the user
            Blog.updateOne(
              { _id: req.query.blogid },
              {
                $pull: {
                  scoreStatus: { voteUser: req.user.id }
                }
              },
              { safe: true, multi: true }
            ).then(result => {});
            // Take off the score for the user
            blog.score += 1;
            blog.save().then(blog => {
              res.send({ newScore: blog.score, colored: false });
            });
            break;
          }
          // If upvoted
          else {
            // Take off the score for the user and upvote
            blog.score -= 2;
            // Set vote to upvote
            blog.scoreStatus[i].vote = "downvote";
            blog.save().then(blog => {
              res.send({ newScore: blog.score, colored: true });
            });
            break;
          }
        }
      }
    }
  });
});

module.exports = router;
