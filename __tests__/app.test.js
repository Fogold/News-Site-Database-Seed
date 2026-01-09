const { app } = require("./../app.js");
const request = require("supertest");
const seed = require("./../db/seeds/seed.js");
const db = require("./../db/connection.js");
const data = require("./../db/data/test-data/index.js");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Topics", () => {
  test("GET all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.img_url).toBe("string");
        });
      });
  });
});

describe("Articles", () => {
  test("GET all Articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string"); //database returns a string - happy to leave it as one for rendering, if it needs to be a num I'll change it
          expect(Array.isArray(article.reactions)).toBe(true);
        });
      });
  });
  test("GET article by ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        const article = body.articles[0];
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        expect(typeof article.comment_count).toBe("string"); //database returns a string - happy to leave it as one for rendering, if it needs to be a num I'll change it
        expect(Array.isArray(article.reactions)).toBe(true);
      });
  });
  test("PATCH an article by increasing or decreasing the votes", () => {
    return db
      .query(`SELECT votes FROM articles WHERE article_id = 1;`)
      .then(({ rows }) => {
        const originalVotes = rows[0].votes;
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5 })
          .expect(202)
          .then(({ body }) => {
            const article = body.articles;
            expect(typeof article).toBe("object");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(article.votes).toBe(originalVotes + 5);
            expect(typeof article.article_img_url).toBe("string");
          });
      });
  });
  test("returns a 400 error when requested article id is invalid", () => {
    return request(app)
      .get("/api/articles/wrong_index")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("returns a 404 error when requested article id doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found!");
      });
  });
  test("returns a 400 error when trying to change an articles votes by 0", () => {
    const votes = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("returns a 404 error when trying to change the votes on an article with a non-existent id", () => {
    const votes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/9999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found!");
      });
  });

  test("GET articles can accept queries to sort the data by a particular column", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "article_id",
          descending: true,
        });
      });
  });

  test("GET articles in ascending order when it is set as a query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "article_id",
          descending: false,
        });
      });
  });

  test("Returns a 400 error if the column set as a sort_by query doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles?sort_by=non_existent_key&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("Returns a 400 error if the order set as a query is neither 'asc' or 'desc'", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=notascordesc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("GET articles of a particular topic when one is put in the query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("GET articles of a particular author when one is put in the query", () => {
    return request(app)
      .get("/api/articles?author=icellusedkars")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.author).toBe("icellusedkars");
        });
        expect(body.articles.length).toBe(6);
      });
  });

  test("returns a 404 if the topic can't be found", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc&topic=false_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found!");
      });
  });
});

describe("Users", () => {
  test("GET all Users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("GET all users with their favourite topic included in each profile", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toHaveProperty("favourite_topic");
        });
      });
  });
  test("GET a single user when their username is written as the request endpoint", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(1);
        const user = body.users[0];
        expect(user).toHaveProperty("username", "icellusedkars");
      });
  });
});

describe("Comments", () => {
  test("GET comments for a particular article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });

  test("GET article comments can accept a query to sort the data by a particular column", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "votes",
          descending: true,
        });
      });
  });

  test("GET article comments can accept a query to sort the data ascending or descending", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "votes",
          descending: false,
        });
      });
  });

  test("GET article comments by a certain user when it's put in the query", () => {
    return request(app)
      .get("/api/articles/1/comments?author=icellusedkars")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment.author).toBe("icellusedkars");
        });
      });
  });

  test("POST a comment onto an article", () => {
    const comment = { username: "lurker", body: "abcdefghijklmnopqrstuvwxyz" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const postedComment = body.comments;
        expect(typeof postedComment).toBe("object");
        expect(typeof postedComment.comment_id).toBe("number");
        expect(typeof postedComment.article_id).toBe("number");
        expect(typeof postedComment.author).toBe("string");
        expect(typeof postedComment.body).toBe("string");
        expect(typeof postedComment.votes).toBe("number");
        expect(typeof postedComment.created_at).toBe("string");
      });
  });

  test("DELETE a comment by ID", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query(`SELECT comment_id FROM comments WHERE comment_id = 1`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
        return;
      });
  });

  test("PATCH a comments votes by increasing or decreasing", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(202)
      .then(({ rows }) => {
        expect(rows.votes).toBe(17);
      });
  });
  test("returns a 400 error when requested comments are from an invalid/non existent article", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("returns a 400 error when a comment is posted to an invalid/non-existent article", () => {
    const comment = { username: "lurker", body: "abcdefghijklmnopqrstuvwxyz" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("returns a 400 error when a comment is posted without either a body or a username", () => {
    const comment = { username: "", body: "" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
});
