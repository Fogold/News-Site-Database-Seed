const {
  extractArticleComments,
  insertComment,
} = require("./../model/comments.model");

function getArticleComments(request, response) {
  return extractArticleComments(request.params["id"])
    .then((rows) => {
      response.status(200).send({ comments: rows });
    })
    .catch((err) => {
      next(err);
    });
}

function postComment(request, response) {
  const { body, params } = request;
  return insertComment(params["id"], body).then((comment) => {
    response.status(201).send(comment);
  });
}

exports.getArticleComments = getArticleComments;
exports.postComment = postComment;
