const express = require("express");
const router = express.Router();

/* Automation route. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Automation" });
});

module.exports = router;
