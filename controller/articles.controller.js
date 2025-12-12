const {
  extractArticles,
  updateArticleVotes,
} = require("./../model/articles.model.js");

function getArticles(request, response) {
  const { id } = request.params;
  const { query } = request;
  return extractArticles(id, query).then((rows) => {
    response.status(200).send({ articles: rows });
  });
}

function patchArticleVotes(request, response) {
  const { inc_votes } = request.body;
  const { id } = request.params;
  if (isNaN(inc_votes) || inc_votes === 0 || isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
  return updateArticleVotes(id, inc_votes).then((article) => {
    response.status(202).send(article);
  });
}

exports.getArticles = getArticles;
exports.patchArticleVotes = patchArticleVotes;
