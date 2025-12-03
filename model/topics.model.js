const db = require("./../db/connection.js");

function extractTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

exports.extractTopics = extractTopics;
