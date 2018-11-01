const express = require("express");
const passport = require("passport");

// Inside Auth's route - .../auth/
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

module.exports = router;
