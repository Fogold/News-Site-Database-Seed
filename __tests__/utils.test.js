const createLookupObject = require("../db/seeds/utils");

describe("createLookupObject", () => {
  test("returns an object", () => {
    expect(
      typeof createLookupObject(
        [
          { 1: "1", 2: "2" },
          { 1: "1", 2: "2" },
        ],
        1,
        2
      )
    ).toBe("object");
  });
});
