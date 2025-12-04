const { app } = require("./../app.js");
const request = require("supertest");
const seed = require("./../db/seeds/seed.js");
const db = require("./../db/connection.js");
const data = require("./../db/data/test-data/index.js");

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
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("GET article by ID", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        const article = body.articles[0];
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        expect(typeof article.comment_count).toBe("number");
      });
  });
  test("Returns 400 error when invalid id is requested", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(400)
      .then((err) => {});
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

  test("POST a comment onto an article", () => {
    const comment = { username: "lurker", body: "abcdefghijklmnopqrstuvwxyz" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(typeof body.comment_id).toBe("number");
        expect(typeof body.article_id).toBe("number");
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.votes).toBe("number");
        expect(typeof body.created_at).toBe("string");
      });
  });
});
