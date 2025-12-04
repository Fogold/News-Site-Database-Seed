const express = require("express");
const { getTopics } = require("./controller/topics.controller.js");
const { getArticles } = require("./controller/articles.controller.js");
const { getUsers } = require("./controller/users.controller.js");
const {
  getArticleComments,
  postComment,
} = require("./controller/comments.controller.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticles);
app.get("/api/articles/:id/comments", getArticleComments);
app.get("/api/users", getUsers);
app.post("/api/articles/:id/comments", postComment);
app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Server error!" });
});

exports.app = app;
