const { findFavouriteTopics } = require("../utils.js");
const db = require("./../db/connection.js");

function extractUsers() {
  const commentsByTopic = db.query(`
        SELECT comments.author, topic FROM comments
          JOIN articles ON comments.article_id = articles.article_id
          JOIN topics ON articles.topic = topics.slug;`);

  const allUsers = db.query(`SELECT * FROM users;`);

  return Promise.all([commentsByTopic, allUsers]).then(
    ([commentsByTopic, allUsers]) => {
      const favTopicsLookup = findFavouriteTopics(commentsByTopic.rows);
      allUsers.rows.forEach((user) => {
        if (favTopicsLookup[user.username]) {
          user.favourite_topic = favTopicsLookup[user.username];
        } else {
          user.favourite_topic = null;
        }
      });
      return allUsers.rows;
    }
  );
}

exports.extractUsers = extractUsers;
