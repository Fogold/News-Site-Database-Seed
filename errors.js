function badRequestHandler(err, request, response, next) {
  response.status(err.status).send(err);
}

function serverErrorHandler(err, request, response, next) {
  response.status(err.status).send(err);
}

function pageNotFoundHandler(err, request, response, next) {
  response.status(err.status).send(err);
}

exports.serverErrorHandler = serverErrorHandler;
exports.badRequestHandler = badRequestHandler;
exports.pageNotFoundHandler = pageNotFoundHandler;
