const {
  extractArticles,
  updateArticleVotes,
  extractArticleById,
} = require("./../model/articles.model.js");

const {
  rejectPromise,
  isValidArticleRequest,
  isValidVoteIncrement,
} = require("./../utils.js");

function getArticles(request, response) {
  const { query } = request;

  return isValidArticleRequest(query)
    ? extractArticles(query).then((rows) => {
        response.status(200).send({ articles: rows });
      })
    : rejectPromise(400);
}

function getArticleById(request, response) {
  const { id } = request.params;
  return !isNaN(id)
    ? extractArticleById(id).then((rows) => {
        response.status(200).send({ articles: rows });
      })
    : rejectPromise(400);
}

function patchArticleVotes(request, response) {
  const { inc_votes } = request.body;
  const { id } = request.params;

  return isValidVoteIncrement(id, inc_votes)
    ? updateArticleVotes(id, inc_votes).then((article) => {
        response.status(202).send(article);
      })
    : rejectPromise(400);
}

exports.getArticles = getArticles;
exports.patchArticleVotes = patchArticleVotes;
exports.getArticleById = getArticleById;
