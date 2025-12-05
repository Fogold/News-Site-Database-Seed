const { articleData } = require("../db/data/test-data/index.js");
const db = require("./../db/connection.js");
const { addCommentCounts } = require("./../utils.js");

function extractArticles(id) {
  if (id && isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }

  let extraction = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles;`;
  if (id) {
    extraction = extraction.slice(0, -1) + ` WHERE article_id = $1;`;
  }

  const tableExtraction = db.query(extraction, id ? [id] : null);
  const commentByArticleExtraction = db.query(
    `SELECT comment_id, article_id FROM comments;`
  );

  return Promise.all([tableExtraction, commentByArticleExtraction])
    .then(([table, comments]) => {
      const articlesWithComments = addCommentCounts(table.rows, comments.rows);

      articlesWithComments.sort((a, b) => {
        return b.created_at - a.created_at;
      });

      if (articlesWithComments.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found!" });
      }

      return articlesWithComments;
    })
    .catch((err) => {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    });
}

function updateArticleVotes(id, voteIncrement) {
  return db
    .query(
      `UPDATE articles SET votes = articles.votes + $1 WHERE article_id = $2 RETURNING *;`,
      [voteIncrement, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found!" });
      }
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    });
}

exports.extractArticles = extractArticles;
exports.updateArticleVotes = updateArticleVotes;
