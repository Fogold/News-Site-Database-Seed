const {
  extractArticleComments,
  insertComment,
  killComment,
  updateCommentVotes,
} = require("./../model/comments.model");

const {
  isValidComment,
  rejectPromise,
  isValidRequest,
  isValidVoteIncrement,
} = require("./../utils.js");

function getArticleComments(request, response) {
  const { id } = request.params;
  const { query } = request;
  const parameters = { id, ...query };
  return isValidRequest(parameters)
    ? extractArticleComments(parameters).then((rows) => {
        response.status(200).send({ comments: rows });
      })
    : rejectPromise(400);
}

function postComment(request, response) {
  const { body } = request;
  const { id } = request.params;

  return isValidComment(body) || isNaN(id)
    ? insertComment(id, body).then((comment) => {
        response.status(201).send({ comments: comment });
      })
    : rejectPromise(400);
}

function deleteComment(request, response) {
  const { comment_id } = request.params;

  return killComment(comment_id).then(() => {
    response.status(204).send();
  });
}

function patchCommentVotes(request, response) {
  const { id } = request.params;
  const { inc_votes } = request.body;

  return isValidVoteIncrement(id, inc_votes)
    ? updateCommentVotes(id, inc_votes).then((comment) => {
        response.status(202).send({ comments: comment });
      })
    : rejectPromise(400);
}

exports.getArticleComments = getArticleComments;
exports.postComment = postComment;
exports.deleteComment = deleteComment;
exports.patchCommentVotes = patchCommentVotes;
