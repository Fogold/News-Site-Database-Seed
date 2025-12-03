const { extractArticles } = require("./../model/articles.model.js");

function getArticles(request, response) {
  return extractArticles().then((rows) => {
    response.status(200).send({ articles: rows });
  });
}

exports.getArticles = getArticles;
