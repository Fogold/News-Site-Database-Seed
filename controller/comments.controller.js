const {
  extractArticleComments,
  insertComment,
  killComment,
} = require("./../model/comments.model");

const { isValidComment, rejectPromise } = require("./../utils.js");

function getArticleComments(request, response) {
  const { id } = request.params;
  return isNaN(id)
    ? rejectPromise(400)
    : extractArticleComments(id).then((rows) => {
        response.status(200).send({ comments: rows });
      });
}

function postComment(request, response) {
  const { body } = request;
  const { id } = request.params;

  return !isValidComment(body) || isNaN(id)
    ? rejectPromise(400)
    : insertComment(id, body).then((comment) => {
        response.status(201).send(comment);
      });
}

function deleteComment(request, response) {
  const { comment_id } = request.params;

  return killComment(comment_id).then(() => {
    response.status(204).send();
  });
}

exports.getArticleComments = getArticleComments;
exports.postComment = postComment;
exports.deleteComment = deleteComment;
