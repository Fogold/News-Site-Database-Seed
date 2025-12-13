const {
  extractArticles,
  updateArticleVotes,
} = require("./../model/articles.model.js");

const { rejectPromise, isValidArticleRequest } = require("./../utils.js");

function getArticles(request, response) {
  const { id } = request.params;
  const { query } = request;

  return isValidArticleRequest(id, query)
    ? extractArticles(id, query).then((rows) => {
        response.status(200).send({ articles: rows });
      })
    : rejectPromise(400);
}

function patchArticleVotes(request, response) {
  const { inc_votes } = request.body;
  const { id } = request.params;

  return isNaN(inc_votes) || inc_votes === 0 || isNaN(id)
    ? rejectPromise(400)
    : updateArticleVotes(id, inc_votes).then((article) => {
        response.status(202).send(article);
      });
}

exports.getArticles = getArticles;
exports.patchArticleVotes = patchArticleVotes;
