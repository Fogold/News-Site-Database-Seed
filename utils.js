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

function isValidComment(comment) {
  return comment.body && comment.username ? true : false;
}

function rejectPromise(httpCode) {
  let message;
  switch (httpCode) {
    case 400:
      message = "Bad Request!";
      break;
    case 404:
      message = "Not Found!";
      break;
    case 500:
      message = "Server Error!";
      break;
    default:
      break;
  }

  return Promise.reject({ status: httpCode, msg: message });
}

function isValidRequest(parameters) {
  const { sort_by, order, topic, author, id } = parameters;
  const validSortColumns = {
    article_id: true,
    author: true,
    topic: true,
    title: true,
    created_at: true,
    votes: true,
  };

  if (id && isNaN(id)) return false;
  if (sort_by && !validSortColumns[sort_by]) return false;
  if (order && order !== "asc" && order !== "desc") return false;
  if (topic && typeof topic !== "string") return false;
  if (author && typeof author !== "string") return false;

  return true;
}

function isValidVoteIncrement(id, inc_votes) {
  return !isNaN(id) && !isNaN(inc_votes) && inc_votes !== 0;
}

function assignReactions(rows) {
  if (!rows) return [];

  const reactions = rows.filter((item) => item.info_type === "Reaction");
  const reactionLookup = {};

  reactions.forEach((item) => {
    let reaction = { username: item.author, emoji: item.title };
    if (reactionLookup[item.article_id]) {
      reactionLookup[item.article_id].push(reaction);
    } else {
      reactionLookup[item.article_id] = [reaction];
    }
  });

  const returnArr = [];

  for (const item of rows) {
    if (item.info_type === "Article") {
      let article = { ...item };

      if (reactionLookup[article.article_id]) {
        article.reactions = reactionLookup[article.article_id];
      } else {
        article.reactions = [];
      }
      returnArr.push(article);
    }
  }

  return returnArr;
}

function createConditionals(parameters) {
  const { topic, author, id, order, sort_by } = parameters;

  const orderStatement = `ORDER BY ${sort_by || "created_at"} ${
    order || "DESC"
  }`;

  const potentialVars = [id, topic, author];

  const paramVars = potentialVars.filter((item) => item);

  if (paramVars.length === 0) return { orderStatement };

  const filters = { article_id: id, topic, author };

  let filterStatement = "";

  for (const item in filters) {
    let itemIndex = paramVars.indexOf(filters[item]);
    if (itemIndex === 0) {
      filterStatement = `WHERE ${item} = $1` + filterStatement;
    }
    if (itemIndex > 0) {
      filterStatement = filterStatement + ` AND ${item} = $${itemIndex + 1}`;
    }
  }

  return { orderStatement, paramVars, filterStatement };
}

exports.createLookupObject = createLookupObject;
exports.connectReactions = connectReactions;
exports.addReactions = addReactions;
exports.findFavouriteTopics = findFavouriteTopics;
exports.createColumnInsertionQuery = createColumnInsertionQuery;
exports.addCommentCounts = addCommentCounts;
exports.isEmptyObject = isEmptyObject;
exports.isValidComment = isValidComment;
exports.rejectPromise = rejectPromise;
exports.isValidRequest = isValidRequest;
exports.isValidVoteIncrement = isValidVoteIncrement;
exports.assignReactions = assignReactions;
exports.createConditionals = createConditionals;
