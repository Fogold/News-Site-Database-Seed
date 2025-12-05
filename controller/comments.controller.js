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
  const { body, params } = request;
  if (!body.username || !body.body || isNaN(params["id"])) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
  return insertComment(params["id"], body).then((comment) => {
    response.status(201).send(comment);
  });
}

function deleteComment(request, response) {
  const { params } = request;

  return killComment(params.comment_id).then(() => {
    response.status(200).send("Deleted");
  });
}

exports.getArticleComments = getArticleComments;
exports.postComment = postComment;
exports.deleteComment = deleteComment;
