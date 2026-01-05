const { findFavouriteTopics } = require("../utils.js");
const db = require("./../db/connection.js");

function extractUsers(parameters) {
  const { username } = parameters;
  const userStatement = `WITH article_counts AS (
    SELECT
        author,
        COUNT(*) AS article_count
    FROM articles
    GROUP BY author
),

comment_counts AS (
    SELECT
        author,
        COUNT(*) AS comment_count
    FROM comments
    GROUP BY author
),

topic_rank AS (
    SELECT
        author,
        topic,
        COUNT(*) AS topic_count,
        ROW_NUMBER() OVER (
            PARTITION BY author
            ORDER BY COUNT(*) DESC
        ) AS rn
    FROM articles
    GROUP BY author, topic
)

SELECT
    u.username,
    u.name,
    u.avatar_url,

    COALESCE(ac.article_count, 0) AS article_count,
    COALESCE(cc.comment_count, 0) AS comment_count,

    tr.topic AS favourite_topic,
    tr.topic_count AS topic_count
FROM users u
LEFT JOIN article_counts ac ON ac.author = u.username
LEFT JOIN comment_counts cc ON cc.author = u.username
LEFT JOIN topic_rank tr
    ON tr.author = u.username
   AND tr.rn = 1${username ? " WHERE u.username = $1" : ""};`;

  const paramVars = username ? [username] : null;

  return db
    .query(userStatement, paramVars)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.extractUsers = extractUsers;
