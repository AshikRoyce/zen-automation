function expect(val) {
  return {
    toBe(val1) {
      if (val == val1) {
        return { result: "Test case passed" };
      } else {
        return { result: "Test case failed" };
      }
    },
  };
}
module.exports = expect;
