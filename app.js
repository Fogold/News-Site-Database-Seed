const express = require("express");
const { getTopics } = require("./controller/topics.controller.js");
const {
  getArticles,
  patchArticleVotes,
} = require("./controller/articles.controller.js");
const { getUsers } = require("./controller/users.controller.js");
const {
  getArticleComments,
  postComment,
} = require("./controller/comments.controller.js");
const app = express();
const {
  badRequestHandler,
  serverErrorHandler,
  pageNotFoundHandler,
} = require("./errors.js");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticles);
app.get("/api/articles/:id/comments", getArticleComments);
app.get("/api/users", getUsers);
app.post("/api/articles/:id/comments", postComment);
app.patch("/api/articles/:id", patchArticleVotes);

app.use(badRequestHandler);
app.use(pageNotFoundHandler);
app.use(serverErrorHandler);

exports.app = app;
