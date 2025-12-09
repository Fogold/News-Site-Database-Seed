function createLookupObject(data, key, value) {
  const obj = {};
  data.forEach((pair) => {
    obj[pair[key]] = pair[value];
  });
  return obj;
}

function connectReactions(articleData, articleLookup, emojiLookup) {
  let returnArr = [];
  for (const article of articleData) {
    returnArr = returnArr.concat(
      article.reactions.map((reaction) => [
        articleLookup[article.title],
        reaction.username,
        emojiLookup[reaction.emoji],
      ])
    );
  }

  return returnArr;
}

function addReactions(articles, reactionTable) {
  reactionLookup = {};

  reactionTable.forEach((reaction) => {
    if (!reactionLookup[reaction.article_id]) {
      reactionLookup[reaction.article_id] = [
        { username: reaction.username, emoji: reaction.emoji },
      ];
    } else {
      reactionLookup[reaction.article_id].push({
        username: reaction.username,
        emoji: reaction.emoji,
      });
    }
  });
  articles.forEach((article) => {
    if (reactionLookup[article.article_id]) {
      article.reactions = reactionLookup[article.article_id];
    } else {
      article.reactions = [];
    }
  });

  return articles;
}

function findFavouriteTopics(commentTopics) {
  const object = {};

  commentTopics.forEach((comment) => {
    if (!object[comment.author]) {
      object[comment.author] = {};
    }

    object[comment.author][comment.topic] =
      (object[comment.author][comment.topic] || 0) + 1;
  });

  for (const author in object) {
    let topics = object[author];
    let topTopic;
    for (const topic in topics) {
      topTopic =
        !topTopic || topics[topic] > topics[topTopic] ? topic : topTopic;
    }

    object[author] = topTopic;
  }

  return object;
}

function createColumnInsertionQuery(
  table,
  newColumn,
  associatedColumn,
  lookupObject
) {
  let query = `ALTER TABLE ${table} ADD ${newColumn} varchar(255); UPDATE ${table} SET ${newColumn} = CASE ${associatedColumn} `;
  for (const key in lookupObject) {
    query += `WHEN '${key}' THEN '${lookupObject[key]}' `;
  }
  query += `ELSE NULL END;`;
  return query;
}

function addCommentCounts(articles, commentIdToArticle) {
  const commentCount = {};

  commentIdToArticle.forEach((comment) => {
    commentCount[comment.article_id] = ++commentCount[comment.article_id] || 1;
  });

  articles.forEach((article) => {
    article.comment_count = commentCount[article.article_id] || 0;
  });

  return articles;
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

exports.createLookupObject = createLookupObject;
exports.connectReactions = connectReactions;
exports.addReactions = addReactions;
exports.findFavouriteTopics = findFavouriteTopics;
exports.createColumnInsertionQuery = createColumnInsertionQuery;
exports.addCommentCounts = addCommentCounts;
exports.isEmptyObject = isEmptyObject;
