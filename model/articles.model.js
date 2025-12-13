const { articleData } = require("../db/data/test-data/index.js");
const db = require("./../db/connection.js");
const {
  addCommentCounts,
  addReactions,
  rejectPromise,
} = require("./../utils.js");

function extractArticles(article_id, query) {
  const id = article_id || null;
  const topic = query.topic || null;
  const column = query.sort_by || "created_at";
  const order = query.order || "desc";

  let parameters = null;
  let extraction = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles`;
  if (id) {
    parameters = [id];
    extraction += ` WHERE article_id = $1`;
  } else if (topic) {
    parameters = [topic];
    extraction += ` WHERE topic = $1`;
  }

  extraction += ` ORDER BY ${column} ${order};`;

  const tableExtraction = db.query(extraction, parameters);
  const commentByArticleExtraction = db.query(
    `SELECT comment_id, article_id FROM comments;`
  );
  const articleReactions = db.query(
    `SELECT article_id, username, emoji FROM emoji_article_user JOIN emojis ON emoji_article_user.emoji_id = emojis.emoji_id;`
  );

  return Promise.all([
    tableExtraction,
    commentByArticleExtraction,
    articleReactions,
  ])
    .then(([table, comments, reactions]) => {
      let articles = addCommentCounts(table.rows, comments.rows);
      articles = addReactions(articles, reactions.rows);

      if (articles.length === 0) {
        return rejectPromise(404);
      }

      return articles;
    })
    .catch((err) => {
      return rejectPromise(404);
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
        return rejectPromise(404);
      }
      return rows[0];
    })
    .catch((err) => {
      return rejectPromise(404);
    });
}

exports.extractArticles = extractArticles;
exports.updateArticleVotes = updateArticleVotes;
