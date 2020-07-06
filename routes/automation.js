/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
const express = require("express");
const path = require("path");
const router = express.Router();
const shell = require("shelljs");
const puppy = require("puppeteer");
const fs = require("fs");

/* Automation route. */
router.get("/task/:task_name", function (req, res, next) {
  const { task_name } = req.params;
  res.sendFile(path.join(__dirname, `../public/html/${task_name}.html`));
});

router.post("/screenshot", async (req, res) => {
  const { url, filename } = req.body;
  async function takeScreenshot(width, height, path) {
    try {
      const browser = await puppy.launch({
        defaultViewport: {
          width: width,
          height: height,
          isLandscape: true,
        },
      });
      const page = await browser.newPage();
      await page.goto(url);
      await page.screenshot({ path: `public/screenshots/${path}.png` });
      await browser.close();
    } catch (error) {
      console.log("something went wrong:::", error);
      res.status(400).json({
        message: "bad request",
      });
    }
  }

  await takeScreenshot(375, 667, filename + "_iphone");
  await takeScreenshot(768, 1024, filename + "_ipad");
  await takeScreenshot(1280, 1024, filename + "_desktop");
  res.status(200).send({ filename });
});

// router.post("/gitclone", async (req, res) => {
//   if (req.body) {
//     var temp = [];
//     var temp2;
//     await shell.cd("clones");
//     await shell.exec(`git clone ${req.body.url} result`);
//     const functions = require("../clones/result/functions");
//     const expect = require("../src/expect");
//     temp.push(expect(functions.add(2, 2)).toBe(4));
//     temp.push(expect(functions.sub(5, 7)).toBe(-2));
//     shell.echo(shell.pwd());
//     temp2 = await shell.exec("eslint result/functions.js");
//     await shell.rm("-rf", "result");
//     res.status(200).json({
//       "Testcase-Results": temp,
//       Warning: temp2,
//     });
//   } else {
//     res.status(400).json({
//       message: "bad request",
//     });
//   }
// });

module.exports = router;
