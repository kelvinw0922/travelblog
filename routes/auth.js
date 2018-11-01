const express = require("express");

// Inside Auth's route - .../auth/
const router = express.Router();

router.get("/google", (req, res) => {
  res.send("Auth");
});

module.exports = router;
