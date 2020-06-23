const express = require("express");
const path = require("path");
const router = express.Router();
const shell = require("shelljs");
const puppy = require("puppeteer");
const fs = require("fs");

/* Automation route. */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/html/sample.html"));
});

router.post("/gitclone", async (req, res) => {
  if (req.body) {
    var temp = [];
    var temp2;
    await shell.cd("clones");
    await shell.exec(`git clone ${req.body.url} result`);
    const functions = require(`../clones/result/functions`);
    const expect = require(`../src/expect`);
    temp.push(expect(functions.add(2, 2)).toBe(4));
    temp.push(expect(functions.sub(5, 7)).toBe(-2));
    shell.echo(shell.pwd());
    temp2 = await shell.exec(`eslint result/functions.js`);
    await shell.rm("-rf", "result");
    res.status(200).json({
      "Testcase-Results": temp,
      Warning: temp2,
    });
  } else {
    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/screenshot", async (req, res) => {
  if (req.body) {
    async function create(w, h, path) {
      const browser = await puppy.launch({
        defaultViewport: {
          width: w,
          height: h,
          isLandscape: true,
        },
      });
      // load page
      const page = await browser.newPage();
      //load url
      const url = await page.goto(req.body.url);
      //take screenshot
      await page.screenshot({ path: `public/screenshots/${path}.png` });
      //close the browser
      await browser.close();
    }

    let path = req.body.url;
    path = path.slice(path.indexOf("//") + 2, path.indexOf(".netlify"));
    create(375, 667, path + "_iphone");
    create(768, 1024, path + "_ipad");
    create(1280, 1024, path + "_desktop");

    res.status(200).json({
      message: "success",
    });
  } else {
    res.status(400).json({
      message: "bad request",
    });
  }
});

module.exports = router;
