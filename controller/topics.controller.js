const { extractTopics } = require("./../model/topics.model.js");

function getTopics(request, response) {
  return extractTopics().then((rows) => {
    response.status(200).send({ topics: rows });
  });
}

exports.getTopics = getTopics;
