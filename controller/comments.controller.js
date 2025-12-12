const {
  extractArticleComments,
  insertComment,
  killComment,
} = require("./../model/comments.model");

function getArticleComments(request, response) {
  const { id } = request.params;
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
  return extractArticleComments(id).then((rows) => {
    response.status(200).send({ comments: rows });
  });
}

function postComment(request, response) {
  const { body } = request;
  const { id } = request.params;
  if (!body.username || !body.body || isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
  return insertComment(id, body).then((comment) => {
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
