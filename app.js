const express = require("express");
const { getTopics } = require("./controller/topics.controller.js");
const { getArticles } = require("./controller/articles.controller.js");
const { getUsers } = require("./controller/users.controller.js");
const app = express();

const port = 8080;

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticles);
app.get("/api/users", getUsers);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Server error!" });
});

exports.app = app;
exports.port = port;
