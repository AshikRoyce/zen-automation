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
    await shell.exec(`git clone ${req.body.url} result`);
    const functions = require(`./result/functions`);
    expect(functions.add(2, 2)).toBe(4);
    expect(functions.sub(5, 7)).toBe(-2);
    function expect(val) {
      return {
        toBe(val1) {
          if (val == val1) {
            temp.push({ result: "Test case passed" });
          } else {
            temp.push({ result: "Test case failed" });
          }
        },
      };
    }
    shell.rm("-rf", "result");
    res.status(200).json({
      message: temp,
    });
  } else {
    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/screenshot", async (req, res) => {
  if (req.body) {
    async function callme(w, h, path) {
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
    callme(375, 667, path + "_iphone");
    callme(768, 1024, path + "_ipad");
    callme(1280, 1024, path + "_desktop");

    res.status(200).json({
      message: "success",
    });
  } else {
    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/eslint", async (req, res) => {
  if (req.body) {
    let temp;
    await shell.exec(`git clone ${req.body.url} result`);
    temp = await shell.exec(`eslint result/sample.js`);
    console.log(temp);
    shell.rm("-rf", "result");
    res.status(200).json({
      message: temp,
    });
  } else {
    res.status(400).json({
      message: "bad request",
    });
  }
});

module.exports = router;
