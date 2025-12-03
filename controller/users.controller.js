const { extractUsers } = require("./../model/users.model.js");

function getUsers(request, response) {
  return extractUsers().then((rows) => {
    response.status(200).send({ users: rows });
  });
}

exports.getUsers = getUsers;
