function createLookupObject(data, key, value) {
  const obj = {};
  data.forEach((pair) => {
    obj[key] = pair[value];
  });
  return obj;
}

function connectReactions(articleData) {
  if (articleData.length === 0) {
    return [];
  }

  return [{ article_name: "", username: "", emoji: "" }];
}

exports.createLookupObject = createLookupObject;
exports.connectReactions = connectReactions;
