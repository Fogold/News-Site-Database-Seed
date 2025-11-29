function createLookupObject(data, key, value) {
  const obj = {};
  data.forEach((pair) => {
    obj[pair[key]] = pair[value];
  });
  return obj;
}

function connectReactions(articleData, articleLookup, emojiLookup) {
  let returnArr = [];
  if (articleData.length === 0) {
    return returnArr;
  }
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

exports.createLookupObject = createLookupObject;
exports.connectReactions = connectReactions;
