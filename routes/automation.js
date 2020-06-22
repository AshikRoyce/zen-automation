const express = require("express");
const path = require("path");
const router = express.Router();
const shell = require("shelljs");

/* Automation route. */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/html/sample.html"));
});

router.post("/gitclone", (req, res) => {
  if (req.body) {
    shell.mkdir(req.body.id);
    shell.cd(req.body.id);
    shell.exec(`git clone ${req.body.url}`);
    res.status(200).json({
      message: "git clone successfull",
    });
  } else {
    res.status(400).json({
      message: "bad request",
    });
  }
});

module.exports = router;
