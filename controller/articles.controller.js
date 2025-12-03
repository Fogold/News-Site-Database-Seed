const { extractArticles } = require("./../model/articles.model.js");

function getArticles(request, response) {
  return extractArticles(request.params["id"])
    .then((rows) => {
      if (rows.length === 0) {
        response.status(400).send("Article does not exist!");
      }
      response.status(200).send({ articles: rows });
    })
    .catch((err) => {
      next(err);
    });
}

exports.getArticles = getArticles;
