const express = require("express");
const cors = require("cors");

const { getTopics } = require("./controller/topics.controller.js");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("./controller/articles.controller.js");
const { getUsers } = require("./controller/users.controller.js");
const {
  getArticleComments,
  postComment,
  deleteComment,
  patchCommentVotes,
} = require("./controller/comments.controller.js");
const {
  badRequestHandler,
  serverErrorHandler,
  pageNotFoundHandler,
} = require("./errors.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticleById);
app.get("/api/articles/:id/comments", getArticleComments);
app.post("/api/articles/:id/comments", postComment);

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUsers);

app.patch("/api/articles/:id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);
app.patch("/api/comments/:comment_id", patchCommentVotes);

app.use(badRequestHandler);
app.use(pageNotFoundHandler);
app.use(serverErrorHandler);

exports.app = app;
