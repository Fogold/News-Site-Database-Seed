const db = require("./db/connection.js");
const format = require("pg-format");
function getUsers() {
  db.query(format(`SELECT name FROM users;`)).then((result) => {
    console.log(result.rows);
  });
}

getUsers();
