const { articleData } = require("../db/data/test-data/index.js");
const db = require("./../db/connection.js");
const {
  addCommentCounts,
  addReactions,
  rejectPromise,
  assignReactions,
} = require("./../utils.js");

function extractArticles(query) {
  const topic = query.topic || null;
  const column = query.sort_by || "created_at";
  const order = query.order || "desc";

  let extraction = `SELECT articles.article_id, title, articles.author, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count, 'Article' AS info_type FROM articles
     JOIN comments ON articles.article_id = comments.article_id
     ${topic ? `WHERE topic = $1` : ""}
     GROUP BY articles.article_id
     UNION
     SELECT emoji_article_user.article_id, emojis.emoji, emoji_article_user.username, NULL::varchar(255) AS topic, NULL::timestamp AS created_at, NULL::int AS votes, NULL::varchar(1000) AS article_img_url, NULL::BIGINT AS comment_count, 'Reaction' AS info_type FROM emoji_article_user
     JOIN emojis ON emoji_article_user.emoji_id = emojis.emoji_id
     ORDER BY ${column} ${order};`;

  return db.query(extraction, topic ? [topic] : null).then(({ rows }) => {
    const articles = assignReactions(rows);
    return articles.length !== 0 ? articles : rejectPromise(404);
  });
}

function extractArticleById(id) {
  return db
    .query(
      `SELECT articles.article_id, title, articles.author, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count, 'Article' AS info_type FROM articles
     JOIN comments ON articles.article_id = comments.article_id
     WHERE articles.article_id = $1
     GROUP BY articles.article_id
     UNION
     SELECT emoji_article_user.article_id, emojis.emoji, emoji_article_user.username, NULL::varchar(255) AS topic, NULL::timestamp AS created_at, NULL::int AS votes, NULL::varchar(1000) AS article_img_url, NULL::BIGINT AS comment_count, 'Reaction' AS info_type FROM emoji_article_user
     JOIN emojis ON emoji_article_user.emoji_id = emojis.emoji_id
     WHERE emoji_article_user.article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) return rejectPromise(404);
      return assignReactions(rows);
    });
}

function updateArticleVotes(id, voteIncrement) {
  return db
    .query(
      `UPDATE articles SET votes = articles.votes + $1 WHERE article_id = $2 RETURNING *;`,
      [voteIncrement, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) return rejectPromise(404);
      return rows[0];
    })
    .catch((err) => {
      return rejectPromise(404);
    });
}

exports.extractArticles = extractArticles;
exports.updateArticleVotes = updateArticleVotes;
exports.extractArticleById = extractArticleById;
