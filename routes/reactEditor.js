const express = require("express");
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get("/app", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/html/react-editor.html"));
});

module.exports = router;
