const express = require("express");
const { getTopics } = require("./controller/topics.controller.js");
const { getArticles } = require("./controller/articles.controller.js");
const app = express();

const port = 8080;

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

exports.app = app;
exports.port = port;
