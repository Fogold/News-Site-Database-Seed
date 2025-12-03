const db = require("./../db/connection.js");

function extractUsers() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
}

exports.extractUsers = extractUsers;
