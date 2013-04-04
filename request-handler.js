var sys = require("sys");
var url = require("url");
var path = require("path");
var fs = require("fs");

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
  };

var messages = {"results": [{'username': 'Howard', 'text':'Yo'}]};

var handleRequest = function(request, response) {
  /* "Status code" and "headers" are HTTP concepts that you can
   * research on the web as and when it becomes necessary. */
  var statusCode = 200;
  /* Without this line, this server wouldn't work.  See the note at
   * the top of this file. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  /* Response is an http.ServerRespone object containing methods for
   * writing our response to the client. Documentation for both request
   * and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html*/
  // var mes = {results:[{'username': 'someone',
  //                     'text': 'Hi!  This is a chat.',
  //                 'roomname': 'default'}]};
    switch (request.url) {
      case '/classes/messages':
          console.log("request: " + request+ " -- " + request.method);
          response.writeHead(statusCode, headers);
        if (request.method === "GET"){
          response.writeHead(statusCode, headers);
          console.log(messages.results);
          response.end(JSON.stringify(messages));
        }
        else if (request.method === "POST"){
          response.writeHead(302, headers);
          request.setEncoding();
          request.on('data', function(data){
            messages.results.push(JSON.parse(data));
            console.log(messages.results);
          });
          response.end();
        } else {
          response.end();
        }
        break;
      case '/':
        headers['Content-Type'] = "text/html";
        response.writeHead(200, headers);
        var filename = "test.txt";

        fs.readFile(filename, "binary", function(err, file) {
          if(err) {
            console.log("Oh noes!!!");
            return;
          }
          var fileStream = fs.createReadStream(filename);
          fileStream.pipe(response);
          console.log(file);
          // response.write(file, "text/html");
          // response.end("Inside File part");
          return;
        })
        // response.end("Home room");

        break;
    default:
      response.writeHead(statusCode, headers);
      var uri = url.parse(request.url).pathname;
      var filename = path.join(process.cwd(), 'htdoc', unescape(uri));
      var stats;

      try {
        stats = fs.lstatSync(filename); //throws if no file
      } catch (e) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 these are not the files you\'re looking for.');
        return;
      }

      if(stats.isFile()) {
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        headers['Content-Type'] = mimeType;
        response.writeHead(200, headers);

        var fileStream = fs.ReadStream(filename);
        fileStream.pipe(response);
      } else if (stats.isDirectory()) {
        headers['Content-Type'] = "text";
        response.writeHead(200, headers);
        response.write('Welcome to the ' +uri+' directory.');
        response.end();
      } else {
        console.log('weird... not a file or a directory or unfound...');
        response.end();
      }
      // response.end(JSON.stringify(messages));
      // response.end("Hello, World!");
  }
   return response;
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;
