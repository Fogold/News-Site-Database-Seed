const {
  createLookupObject,
  connectReactions,
  findFavouriteTopics,
  createColumnInsertionQuery,
  addReactions,
  isValidComment,
  isValidArticleRequest,
  isValidVoteIncrement,
} = require("../utils");

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
    const emojiLookup = createLookupObject(
      [
        { emoji: "&#128077;", emoji_id: 1 },
        { emoji: "&#128077;", emoji_id: 2 },
        { emoji: "&#128515;", emoji_id: 3 },
        { emoji: "&#128514;", emoji_id: 4 },
        { emoji: "&#128559;", emoji_id: 5 },
        { emoji: "&#128546;", emoji_id: 6 },
      ],
      "emoji",
      "emoji_id"
    );
    const articleLookup = createLookupObject(
      [{ title: "Stone Soup", article_id: 35 }],
      "title",
      "article_id"
    );
    expect(connectReactions(testArr, articleLookup, emojiLookup)).toEqual([
      [35, "weegembump", 6],
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
    const emojiLookup = createLookupObject(
      [
        { emoji: "&#128077;", emoji_id: 1 },
        { emoji: "&#128077;", emoji_id: 2 },
        { emoji: "&#128515;", emoji_id: 3 },
        { emoji: "&#128514;", emoji_id: 4 },
        { emoji: "&#128559;", emoji_id: 5 },
        { emoji: "&#128546;", emoji_id: 6 },
      ],
      "emoji",
      "emoji_id"
    );
    const articleLookup = createLookupObject(
      [
        {
          title:
            "Twice-Baked Butternut Squash Is the Thanksgiving Side Dish of Your Dreams",
          article_id: 30,
        },
        { title: "Stone Soup", article_id: 35 },
      ],
      "title",
      "article_id"
    );
    expect(connectReactions(testArr, articleLookup, emojiLookup)).toEqual([
      [35, "weegembump", 6],
      [30, "weegembump", 6],
    ]);
  });

  test("returns an array of arrays with the correct values if the input has multiple objects with multiple reactions", () => {
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
    const emojiLookup = createLookupObject(
      [
        { emoji: "&#128077;", emoji_id: 1 },
        { emoji: "&#128077;", emoji_id: 2 },
        { emoji: "&#128515;", emoji_id: 3 },
        { emoji: "&#128514;", emoji_id: 4 },
        { emoji: "&#128559;", emoji_id: 5 },
        { emoji: "&#128546;", emoji_id: 6 },
      ],
      "emoji",
      "emoji_id"
    );
    const articleLookup = createLookupObject(
      [
        { title: "Running a Node App", article_id: 1 },
        { title: "Using React Native: One Year Later", article_id: 7 },
        { title: "HOW COOKING HAS CHANGED US", article_id: 26 },
        { title: "Thanksgiving Drinks for Everyone", article_id: 27 },
        { title: "High Altitude Cooking", article_id: 28 },
        { title: "The vegan carnivore?", article_id: 36 },
      ],
      "title",
      "article_id"
    );

    expect(connectReactions(testArr, articleLookup, emojiLookup)).toEqual([
      [28, "jessjelly", 4],
      [28, "cooljmessy", 5],
      [36, "jessjelly", 4],
      [36, "weegembump", 6],
      [36, "happyamy2016", 3],
    ]);
  });
  test("check for mutation", () => {
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
    const emojiLookup = createLookupObject(
      [
        { emoji: "&#128077;", emoji_id: 1 },
        { emoji: "&#128077;", emoji_id: 2 },
        { emoji: "&#128515;", emoji_id: 3 },
        { emoji: "&#128514;", emoji_id: 4 },
        { emoji: "&#128559;", emoji_id: 5 },
        { emoji: "&#128546;", emoji_id: 6 },
      ],
      "emoji",
      "emoji_id"
    );
    const articleLookup = createLookupObject(
      [
        { title: "Running a Node App", article_id: 1 },
        { title: "Using React Native: One Year Later", article_id: 7 },
        { title: "HOW COOKING HAS CHANGED US", article_id: 26 },
        { title: "Thanksgiving Drinks for Everyone", article_id: 27 },
        { title: "High Altitude Cooking", article_id: 28 },
        { title: "The vegan carnivore?", article_id: 36 },
      ],
      "title",
      "article_id"
    );

    connectReactions(testArr, articleLookup, emojiLookup);

    expect(testArr).toEqual([
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
    ]);
  });
});

describe("findFavouriteTopics", () => {
  test("returns an object", () => {
    expect(
      typeof findFavouriteTopics([{ author: "weegembump", topic: "coding" }])
    ).toBe("object");
  });
  test("check for mutation", () => {
    const commentsData = [{ author: "weegembump", topic: "coding" }];
    findFavouriteTopics(commentsData);
    expect(commentsData).toEqual([{ author: "weegembump", topic: "coding" }]);
  });
  test("returns an object with a single username key and topic value when a single comment is passed", () => {
    const comments = [{ author: "weegembump", topic: "coding" }];
    expect(findFavouriteTopics(comments)).toEqual({ weegembump: "coding" });
  });
  test("returns an object with a 2 username keys with topic values when 2 comments by two different users is passed", () => {
    const comments = [
      { author: "weegembump", topic: "coding" },
      { author: "happyamy2016", topic: "cooking" },
    ];
    expect(findFavouriteTopics(comments)).toEqual({
      weegembump: "coding",
      happyamy2016: "cooking",
    });
  });
  test("returns an object with a single username key and topic value when 2 comments by the same user is passed", () => {
    const comments = [
      { author: "weegembump", topic: "coding" },
      { author: "weegembump", topic: "coding" },
    ];
    expect(findFavouriteTopics(comments)).toEqual({ weegembump: "coding" });
  });
  test("returns an object with a single username key and topic value when 2 comments by the same user is passed", () => {
    const comments = [
      { author: "weegembump", topic: "coding" },
      { author: "weegembump", topic: "coding" },
    ];
    expect(findFavouriteTopics(comments)).toEqual({ weegembump: "coding" });
  });
  test("returns an object with a single username key with the most frequent topic when multiple comments by the same user is passed", () => {
    const comments = [
      { author: "weegembump", topic: "coding" },
      { author: "weegembump", topic: "coding" },
      { author: "weegembump", topic: "cooking" },
      { author: "weegembump", topic: "football" },
    ];
    expect(findFavouriteTopics(comments)).toEqual({ weegembump: "coding" });
  });
  test("returns an object with a multiple username keys with their most frequent topic when multiple comments by multiple users are passed", () => {
    const comments = [
      { author: "weegembump", topic: "coding" },
      { author: "weegembump", topic: "coding" },
      { author: "weegembump", topic: "cooking" },
      { author: "weegembump", topic: "football" },
      { author: "happyamy2016", topic: "cooking" },
      { author: "grumpy19", topic: "football" },
      { author: "grumpy19", topic: "coding" },
      { author: "grumpy19", topic: "football" },
      { author: "cooljmessy", topic: "coding" },
      { author: "cooljmessy", topic: "cooking" },
      { author: "cooljmessy", topic: "cooking" },
    ];
    expect(findFavouriteTopics(comments)).toEqual({
      weegembump: "coding",
      happyamy2016: "cooking",
      grumpy19: "football",
      cooljmessy: "cooking",
    });
  });
});

describe("createColumnInsertionQuery", () => {
  test("returns a string", () => {
    expect(
      typeof createColumnInsertionQuery("articles", "colour", "topic", {
        cooking: "blue",
      })
    ).toBe("string");
  });
  test("returns a string containing the correct SQL keywords for the first part of the query", () => {
    const result = createColumnInsertionQuery("articles", "colour", "topic", {
      cooking: "blue",
    });
    expect(result).toContain("ALTER TABLE");
    expect(result).toContain("ADD");
    expect(result).toContain("UPDATE");
    expect(result).toContain("SET");
    expect(result).toContain("CASE");
  });
  test("returns a string containing the correct parameters for the first part of the query", () => {
    const result = createColumnInsertionQuery("articles", "colour", "topic", {
      cooking: "blue",
    });
    expect(result).toContain(
      `ALTER TABLE articles ADD colour varchar(255); UPDATE articles SET colour = CASE topic`
    );
  });
  test("returns a string containing the correct parameters when there is an key/value pair in the lookupObject", () => {
    const result = createColumnInsertionQuery("articles", "colour", "topic", {
      cooking: "blue",
    });
    expect(result).toBe(
      `ALTER TABLE articles ADD colour varchar(255); UPDATE articles SET colour = CASE topic WHEN 'cooking' THEN 'blue' ELSE NULL END;`
    );
  });
  test("returns a string containing the correct parameters when some of the lookUp keys/values are other data types than string", () => {
    const result = createColumnInsertionQuery("articles", "colour", "topic", {
      1: true,
    });
    expect(result).toBe(
      `ALTER TABLE articles ADD colour varchar(255); UPDATE articles SET colour = CASE topic WHEN '1' THEN 'true' ELSE NULL END;`
    );
  });
  test("returns a string containing the correct parameters when there are multiple entries in the lookUp object", () => {
    const result = createColumnInsertionQuery("articles", "colour", "topic", {
      cooking: "blue",
      coding: "green",
    });
    expect(result).toBe(
      `ALTER TABLE articles ADD colour varchar(255); UPDATE articles SET colour = CASE topic WHEN 'cooking' THEN 'blue' WHEN 'coding' THEN 'green' ELSE NULL END;`
    );
  });
});

describe("addReactions", () => {
  test("returns an Array", () => {
    expect(Array.isArray(addReactions([], []))).toBe(true);
  });
  test("returns an array of objects", () => {
    const result = addReactions([], []);
    result.forEach((article) => {
      expect(typeof article).toEqual("object");
    });
  });
  test("all articles have a reactions key", () => {
    const articleData = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 105,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const reactionData = [
      {
        article_id: 1,
        username: "butter_bridge",
        emoji: "happyface",
      },
    ];

    const result = addReactions(articleData, reactionData);

    result.forEach((article) => {
      expect(article).toHaveProperty("reactions");
    });
  });
  test("all articles have a key of reactions with the value of an array of objects", () => {
    const articleData = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 105,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const reactionData = [
      {
        article_id: 1,
        username: "butter_bridge",
        emoji: "happyface",
      },
    ];

    const result = addReactions(articleData, reactionData);

    result.forEach((article) => {
      expect(Array.isArray(article.reactions)).toBe(true);
      expect(typeof article.reactions[0]).toBe("object");
    });
  });
  test("all articles have a key of reactions with the value of an array of reaction objects containing a username and emoji", () => {
    const articleData = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 105,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const reactionData = [
      {
        article_id: 1,
        username: "butter_bridge",
        emoji: "happyface",
      },
    ];

    const result = addReactions(articleData, reactionData);

    result.forEach((article) => {
      expect(article.reactions[0]).toEqual({
        username: "butter_bridge",
        emoji: "happyface",
      });
    });
  });
});

describe("isValidComment", () => {
  test("returns a boolean", () => {
    expect(typeof isValidComment({ body: "", username: "" })).toBe("boolean");
  });
  test("returns false if passed object does not contain body or username properties", () => {
    expect(isValidComment({})).toBe(false);
  });
  test("returns true if comment contains a username and a body", () => {
    expect(isValidComment({ username: "Joe", body: "Hello world!" })).toBe(
      true
    );
  });
});

describe("isValidArticleRequest", () => {
  test("returns a boolean", () => {
    expect(typeof isValidArticleRequest()).toBe("boolean");
  });
  test("returns false when the passed id is not a number", () => {
    expect(isValidArticleRequest("not a number")).toBe(false);
  });
  test("returns false when the sort by query is not a valid column to use", () => {
    expect(isValidArticleRequest(1, { sort_by: "Invalid Column" })).toBe(false);
  });
  test("returns false when the order query is neither asc nor desc", () => {
    expect(isValidArticleRequest(1, { order: "Invalid order" })).toBe(false);
  });
  test("returns false when the topic query is not a string", () => {
    expect(isValidArticleRequest(1, { topic: 123 })).toBe(false);
  });
  test("returns true when all qualifiers are passed", () => {
    expect(
      isValidArticleRequest(1, {
        sort_by: "created_at",
        order: "asc",
        topic: "mitch",
      })
    ).toBe(true);
  });
  test("test for mutation", () => {
    const queryObject = {
      topic: "mitch",
    };
    expect(isValidArticleRequest(1, queryObject)).toBe(true);
    expect(queryObject).toEqual({ topic: "mitch" });
  });

  describe("isValidVoteIncrement", () => {
    test("returns a boolean", () => {
      expect(typeof isValidVoteIncrement(1, {})).toBe("boolean");
    });
    test("returns false if id is not a number", () => {
      expect(isValidVoteIncrement("NaN", 1)).toBe(false);
    });
    test("returns false if inc_votes is not a number", () => {
      expect(isValidVoteIncrement(1, "NaN")).toBe(false);
    });
    test("returns false if inc_votes equals 0", () => {
      expect(isValidVoteIncrement(1, 0)).toBe(false);
    });
  });
});
