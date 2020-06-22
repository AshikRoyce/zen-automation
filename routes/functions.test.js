const functions = require("/user1/functions.js");
const { test } = require("shelljs");

test("addtition of two numbers", () => {
  expect(functions.add(2, 2).toBe(4));
});

test("subtraction of two numbers", () => {
  expect(functions.sub(5, 7).toBe(-2));
});
