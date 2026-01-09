const db = require("./../db/connection.js");
const { createConditionals } = require("./../utils.js");

function extractArticleComments(parameters) {
  const { paramVars, filterStatement, orderStatement } =
    createConditionals(parameters);

  const extraction = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments 
       ${filterStatement || ""} 
       ${orderStatement};`;

  return db.query(extraction, paramVars || null).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad Request!" });
    }
    return rows;
  });
}

function insertComment(id, comment) {
  return db
    .query(
      `INSERT INTO comments (article_id, body, votes, author) VALUES ($1, $2, 0, $3) RETURNING *;`,
      [id, comment.body, comment.username]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject({ status: 400, msg: "Bad Request!" });
    });
}

function killComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .catch((err) => {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    });
}

function updateCommentVotes(id, voteIncrement) {
  return db
    .query(
      `UPDATE comments SET votes = comments.votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [voteIncrement, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) return rejectPromise(404);
      return rows[0];
    })
    .catch(() => {
      return rejectPromise(404);
    });
}

exports.extractArticleComments = extractArticleComments;
exports.insertComment = insertComment;
exports.killComment = killComment;
exports.updateCommentVotes = updateCommentVotes;
