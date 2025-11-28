const { createLookupObject, connectReactions } = require("../db/seeds/utils");

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

describe("connectReactions", () => {
  test("returns an array", () => {
    expect(Array.isArray(connectReactions([]))).toBe(true);
  });
  test("returns an array containing nothing if there is no data in the articleData array", () => {
    expect(connectReactions([])).toEqual([]);
  });
  test("returns an array with an object in it when an array with an object is used as the argument", () => {
    expect(
      typeof connectReactions([
        {
          title: "Stone Soup",
          topic: "cooking",
          author: "cooljmessy",
          body: "The first day I put my family on a Paleolithic diet, I made my kids fried eggs and sausage for breakfast. If they were still hungry, I told them, they could help themselves to more sausage, but they were not allowed to grab a slice of bread, or toast an English muffin, or pour themselves a bowl of cereal. This represented a reversal of the usual strictures, and they were happy to oblige. It was like some weird, unexpected holiday—Passover in July.",
          created_at: new Date(1590477900000),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/33242/cooking-ingredient-cuisine-kitchen.jpg?w=700&h=700",
          reactions: [{ username: "weegembump", emoji: "&#128546;" }],
        },
      ])[0]
    ).toEqual("object");
  });
  test("returns an array with an object with a username, article name and emoji as keys", () => {
    testArr = [
      {
        title: "Stone Soup",
        topic: "cooking",
        author: "cooljmessy",
        body: "The first day I put my family on a Paleolithic diet, I made my kids fried eggs and sausage for breakfast. If they were still hungry, I told them, they could help themselves to more sausage, but they were not allowed to grab a slice of bread, or toast an English muffin, or pour themselves a bowl of cereal. This represented a reversal of the usual strictures, and they were happy to oblige. It was like some weird, unexpected holiday—Passover in July.",
        created_at: new Date(1590477900000),
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/33242/cooking-ingredient-cuisine-kitchen.jpg?w=700&h=700",
        reactions: [{ username: "weegembump", emoji: "&#128546;" }],
      },
    ];
    expect(connectReactions(testArr)[0]).toHaveProperty("article_name");
    expect(connectReactions(testArr)[0]).toHaveProperty("username");
    expect(connectReactions(testArr)[0]).toHaveProperty("emoji");
  });
});
