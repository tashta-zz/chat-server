var http = require("http");
var router = require("./router.js");

var requestListener = function (request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  router.handleRequest(request, response);
};

/* These headers will allow Cross-Origin Resource Sharing.
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */

var port = 8080;
var ip = "127.0.0.1";

var server = http.createServer(requestListener);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);