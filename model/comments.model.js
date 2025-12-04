const db = require("./../db/connection.js");

function extractArticleComments(id) {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      rows.sort((a, b) => {
        return b.created_at - a.created_at;
      });
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
      console.log(rows);
      return rows[0];
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.extractArticleComments = extractArticleComments;
exports.insertComment = insertComment;
