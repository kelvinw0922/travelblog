const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

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

module.exports = router;
