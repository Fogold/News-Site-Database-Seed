const db = require("./../db/connection.js");

function extractArticles(id) {
  const tableExtraction = !id
    ? db.query(
        `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles;`
      )
    : db.query(
        `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;`,
        [id]
      );
  const commentByArticleExtraction = db.query(
    `SELECT comment_id, article_id FROM comments;`
  );

  return Promise.all([tableExtraction, commentByArticleExtraction]).then(
    ([table, comments]) => {
      const commentCount = {};

      comments.rows.forEach((comment) => {
        commentCount[comment.article_id] =
          ++commentCount[comment.article_id] || 1;
      });

      table.rows.forEach((article) => {
        article.comment_count = commentCount[article.article_id] || 0;
      });

      table.rows.sort((a, b) => {
        return b.created_at - a.created_at;
      });

      return table.rows;
    }
  );
}

exports.extractArticles = extractArticles;
