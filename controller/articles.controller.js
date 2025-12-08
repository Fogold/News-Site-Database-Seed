const {
  extractArticles,
  updateArticleVotes,
} = require("./../model/articles.model.js");

function getArticles(request, response) {
  return extractArticles(request.params["id"], request.query).then((rows) => {
    response.status(200).send({ articles: rows });
  });
}

function patchArticleVotes(request, response) {
  const { body, params } = request;
  if (isNaN(body.inc_votes) || body.inc_votes === 0 || isNaN(params.id)) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
  return updateArticleVotes(params.id, body.inc_votes).then((article) => {
    response.status(202).send(article);
  });
}

exports.getArticles = getArticles;
exports.patchArticleVotes = patchArticleVotes;
