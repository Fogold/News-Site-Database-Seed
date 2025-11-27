const db = require("../connection");
var format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS comments;
       DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS topics;

    CREATE TABLE topics (
      slug varchar(255) PRIMARY KEY, 
      description varchar(255), 
      img_url varchar(1000)
    ); 

    CREATE TABLE users (
      username varchar(255) PRIMARY KEY,
      name varchar(255),
      avatar_url varchar(1000)
    ); 

    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title varchar(255), 
      topic varchar(255) REFERENCES topics(slug), 
      author varchar(255) REFERENCES users(username), 
      body text, 
      created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
      votes int DEFAULT 0, 
      article_img_url varchar(1000)
    ); 

    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id int REFERENCES articles(article_id),
      body text,
      votes int DEFAULT 0, 
      author varchar(255) REFERENCES users(username), 
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    );`
    )
    .then(() => {
      return db.query(
        format(
          `INSERT INTO topics (description, slug, img_url) VALUES %L`,
          topicData.map((topic) => [
            topic.description,
            topic.slug,
            topic.img_url,
          ])
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO users (username, name, avatar_url) VALUES %L`,
          userData.map((user) => [user.username, user.name, user.avatar_url])
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L`,
          articleData.map((article) => [
            article.title,
            article.topic,
            article.author,
            article.body,
            article.created_at,
            article.votes,
            article.article_img_url,
          ])
        )
      );
    })
    .then(() => {
      db.query(
        format(
          `INSERT INTO comments (body, votes, author, created_at) VALUES %L`,
          commentData.map((comment) => [
            comment.body,
            comment.votes,
            comment.author,
            comment.created_at,
          ])
        )
      );
    });
};
module.exports = seed;
