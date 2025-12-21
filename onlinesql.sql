DROP TABLE IF EXISTS emoji_article_user;
      DROP TABLE IF EXISTS emojis;
      DROP TABLE IF EXISTS comments;
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
    );
    
    CREATE TABLE emojis (
        emoji_id SERIAL PRIMARY KEY,
        emoji varchar(255) NOT NULL);
        
        CREATE TABLE emoji_article_user (
        emoji_article_user_id SERIAL PRIMARY KEY,
        article_id int REFERENCES articles(article_id),
        username varchar(255) REFERENCES users(username),
        emoji_id int REFERENCES emojis(emoji_id));
        
        INSERT INTO topics (description, slug, img_url) VALUES ('topic name', 'topic', 'img.com');
        INSERT INTO users (username, name, avatar_url) VALUES ('username', 'Scott', 'avatar.com');
        INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES ('Breaking news', 'topic', 'username', 'This is the body of an article', '01-01-22', 4, 'articleimg.com');
        INSERT INTO comments (article_id, body, votes, author, created_at) VALUES (1, 'This is a comment', 3, 'username', '02-01-22');
        INSERT INTO comments (article_id, body, votes, author, created_at) VALUES (1, 'This is another comment', 2, 'username', '02-01-22');
        INSERT INTO emojis (emoji) VALUES ('smile');
        INSERT INTO emojis (emoji) VALUES ('laugh');
        INSERT INTO emoji_article_user(article_id, username, emoji_id) VALUES (1, 'username', 1);
        INSERT INTO emoji_article_user(article_id, username, emoji_id) VALUES (1, 'username', 2);
        
        SELECT * FROM articles 
      	FULL JOIN comments ON articles.article_id = comments.article_id 
      	FULL JOIN emoji_article_user ON articles.article_id = emoji_article_user.article_id 
      	LEFT JOIN emojis ON emoji_article_user.emoji_id = emojis.emoji_id 
      	WHERE articles.article_id = 1;
        
        