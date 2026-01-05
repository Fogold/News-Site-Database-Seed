const { extractUsers } = require("./../model/users.model.js");
const { isValidRequest } = require("./../utils.js");

function getUsers(request, response) {
  const { username } = request.params;
  const parameters = { username };
  return isValidRequest(parameters)
    ? extractUsers(parameters).then((rows) => {
        response.status(200).send({ users: rows });
      })
    : rejectPromise(400);
}

exports.getUsers = getUsers;
