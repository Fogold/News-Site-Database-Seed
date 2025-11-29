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
  test("returns an array with an array in it when an array with an object is used as the argument", () => {
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
  test("returns an array with an array containing the correct values for username, article_name and emoji", () => {
    const testArr = [
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
    expect(connectReactions(testArr)).toEqual([
      ["Stone Soup", "weegembump", "&#128546;"],
    ]);
  });
  test("returns an array of arrays with the correct values if the input has multiple objects with ONLY one reaction instance", () => {
    const testArr = [
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
      {
        title:
          "Twice-Baked Butternut Squash Is the Thanksgiving Side Dish of Your Dreams",
        topic: "cooking",
        author: "jessjelly",
        body: "What if, for once, your Thanksgiving sides were just as dazzling as the centerpiece turkey? Imagine a world where presenting a platter of seasonal vegetables inspires the same amount of cooing that the turkey does. Welcome to the world of twice-baked butternut squash. Sure, you could just roast some squash wedges and call it a day. But where's the fun in that? To make this year's most impressive vegetable side, Epi's food director Rhoda Boone gave super-seasonal butternut squash the twice-baked potatoes treatment: Mash the inside of the vegetable with butter, cream, and anything else that might make it more delicious, then pile it back into the vegetable, bake it until golden and velvety. The result is a jaw-dropping, brightly colored sweet-meet-savory butternut squash side dish. Here are just a few more reasons this creation belongs on this year's Thanksgiving table:",
        created_at: new Date(1578774000000),
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/175753/pexels-photo-175753.jpeg?w=700&h=700",
        reactions: [{ username: "weegembump", emoji: "&#128546;" }],
      },
    ];
    expect(connectReactions(testArr)).toEqual([
      ["Stone Soup", "weegembump", "&#128546;"],
      [
        "Twice-Baked Butternut Squash Is the Thanksgiving Side Dish of Your Dreams",
        "weegembump",
        "&#128546;",
      ],
    ]);
  });
  test("returns an array of arrays with the correct values if the input has multiple objects with ONLY one reaction instance", () => {
    const testArr = [
      {
        title: "High Altitude Cooking",
        topic: "cooking",
        author: "happyamy2016",
        body: "Most backpacking trails vary only a few thousand feet elevation. However, many trails can be found above 10,000 feet. But what many people don’t take into consideration at these high altitudes is how these elevations affect their cooking.",
        created_at: new Date(1578097440000),
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?w=700&h=700",
        reactions: [
          { username: "jessjelly", emoji: "&#128514;" },
          { username: "cooljmessy", emoji: "&#128559;" },
        ],
      },
      {
        title: "The vegan carnivore?",
        topic: "cooking",
        author: "tickle122",
        body: "The chef Richard McGeown has faced bigger culinary challenges in his distinguished career than frying a meat patty in a little sunflower oil and butter. But this time the eyes and cameras of hundreds of journalists in the room were fixed on the 5oz (140g) pink disc sizzling in his pan, one that had been five years and €250,000 in the making. This was the world’s first proper portion of cultured meat, a beef burger created by Mark Post, professor of physiology, and his team at Maastricht University in the Netherlands. Post (which rhymes with ‘lost’, not ‘ghost’) has been working on in vitro meat (IVM) since 2009. On 5 August this year he presented his cultured beef burger to the world as a ‘proof of concept’. Having shown that the technology works, Post believes that in a decade or so we could see commercial production of meat that has been grown in a lab rather than reared and slaughtered. The comforting illusion that supermarket trays of plastic-wrapped steaks are not pieces of dead animal might become a discomforting reality.",
        created_at: new Date(1583788860000),
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?w=700&h=700",
        reactions: [
          { username: "jessjelly", emoji: "&#128514;" },
          { username: "weegembump", emoji: "&#128546;" },
          { username: "happyamy2016", emoji: "&#128515;" },
        ],
      },
    ];

    expect(connectReactions(testArr)).toEqual([
      ["High Altitude Cooking", "jessjelly", "&#128514;"],
      ["High Altitude Cooking", "cooljmessy", "&#128559;"],
      ["The vegan carnivore?", "jessjelly", "&#128514;"],
      ["The vegan carnivore?", "weegembump", "&#128546;"],
      ["The vegan carnivore?", "happyamy2016", "&#128515;"],
    ]);
  });
});
