const db = require("../connection");
const format = require("pg-format");
const {
  createLookupObject,
  connectReactions,
  findFavouriteTopics,
  createColumnInsertionQuery,
} = require("../../utils.js");

const seed = ({ topicData, userData, articleData, commentData, emojiData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS emoji_article_user;
      DROP TABLE IF EXISTS emojis;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS topics;`
    )
    .then(() => {
      return Promise.all([
        db.query(
          `CREATE TABLE topics (
      slug varchar(255) PRIMARY KEY, 
      description varchar(255), 
      img_url varchar(1000)
    ); `
        ),
        db.query(
          `CREATE TABLE users (
      username varchar(255) PRIMARY KEY,
      name varchar(255),
      avatar_url varchar(1000)
    ); `
        ),
      ]);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title varchar(255), 
      topic varchar(255) REFERENCES topics(slug), 
      author varchar(255) REFERENCES users(username), 
      body text, 
      created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
      votes int DEFAULT 0, 
      article_img_url varchar(1000)
    ); `
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id int REFERENCES articles(article_id),
      body text,
      votes int DEFAULT 0, 
      author varchar(255) REFERENCES users(username), 
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    );`
      );
    })
    .then(() => {
      return db.query(`CREATE TABLE emojis (
        emoji_id SERIAL PRIMARY KEY,
        emoji varchar(255) NOT NULL);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE emoji_article_user (
        emoji_article_user_id SERIAL PRIMARY KEY,
        article_id int REFERENCES articles(article_id),
        username varchar(255) REFERENCES users(username),
        emoji_id int REFERENCES emojis(emoji_id));`);
    })
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
          `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING article_id, title`,
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
    .then(({ rows }) => {
      const lookupObj = createLookupObject(rows, "title", "article_id");
      return db.query(
        format(
          `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
          commentData.map((comment) => [
            lookupObj[comment.article_title],
            comment.body,
            comment.votes,
            comment.author,
            comment.created_at,
          ])
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO emojis (emoji) VALUES %L`,
          emojiData.map((emoji) => [emoji.emoji])
        )
      );
    })
    .then(() => {
      const articlePromise = db.query(
        `SELECT title, article_id FROM articles;`
      );
      const emojiPromise = db.query(`SELECT emoji, emoji_id FROM emojis;`);
      return Promise.all([articlePromise, emojiPromise]);
    })
    .then(([articleTable, emojiTable]) => {
      const articleLookup = createLookupObject(
        articleTable.rows,
        "title",
        "article_id"
      );
      const emojiLookup = createLookupObject(
        emojiTable.rows,
        "emoji",
        "emoji_id"
      );
      return db.query(
        format(
          `INSERT INTO emoji_article_user(article_id, username, emoji_id) VALUES %L`,
          connectReactions(articleData, articleLookup, emojiLookup)
        )
      );
    });
};

module.exports = seed;
