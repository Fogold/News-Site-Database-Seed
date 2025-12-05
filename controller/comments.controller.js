const {
  extractArticleComments,
  insertComment,
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

exports.getArticleComments = getArticleComments;
exports.postComment = postComment;
