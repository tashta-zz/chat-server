var controller = require('./controller.js');

var handleRequest = function(request, response) {
  switch (request.url) {
    case '/classes/messages':
      controller.getMessages(request, response);
      break;
    case '/':
      controller.index(request, response);
      break;
    default:
      controller.serveStatic(request, response);
  }
  return response;
};

exports.handleRequest = handleRequest;
