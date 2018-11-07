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

module.exports = router;
