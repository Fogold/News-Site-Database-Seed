const db = require("./db/connection.js");
const format = require("pg-format");

function getUsers() {
  db.query(format(`SELECT name FROM users;`)).then((result) => {
    console.log(result.rows);
  });
}

function getArticlesAboutCoding() {
  db.query(format(`SELECT title FROM articles WHERE topic = 'coding';`)).then(
    (result) => {
      console.log(result.rows);
    }
  );
}

function getNegativeRatedComments() {
  db.query(format(`SELECT * FROM comments WHERE votes < 0;`)).then(
    ({ rows }) => {
      console.log(rows);
    }
  );
}

function getTopics() {
  db.query(format(`SELECT slug FROM topics;`)).then(({ rows }) => {
    console.log(rows);
  });
}

function getArticlesByUser(username) {
  db.query(
    format(`SELECT title FROM articles WHERE author = '${username}';`)
  ).then(({ rows }) => {
    console.log(rows);
  });
}

function getHighRatedComments(threshold) {
  db.query(format(`SELECT * FROM comments WHERE votes > ${threshold};`)).then(
    ({ rows }) => {
      console.log(rows);
    }
  );
}
//getUsers();
//getArticlesAboutCoding();
//getNegativeRatedComments();
//getTopics();
//getArticlesByUser("grumpy19");
//getHighRatedComments(10);
