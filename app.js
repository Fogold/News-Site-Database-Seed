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
  deleteComment,
} = require("./controller/comments.controller.js");
const {
  badRequestHandler,
  serverErrorHandler,
  pageNotFoundHandler,
} = require("./errors.js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticles);
app.get("/api/articles/:id/comments", getArticleComments);
app.get("/api/users", getUsers);
app.post("/api/articles/:id/comments", postComment);
app.patch("/api/articles/:id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

app.use(badRequestHandler);
app.use(pageNotFoundHandler);
app.use(serverErrorHandler);

exports.app = app;
