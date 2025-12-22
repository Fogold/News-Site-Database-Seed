const {
  extractArticleComments,
  insertComment,
  killComment,
} = require("./../model/comments.model");

const { isValidComment, rejectPromise } = require("./../utils.js");

function getArticleComments(request, response) {
  const { id } = request.params;
  return !isNaN(id)
    ? extractArticleComments(id).then((rows) => {
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

exports.getArticleComments = getArticleComments;
exports.postComment = postComment;
exports.deleteComment = deleteComment;
