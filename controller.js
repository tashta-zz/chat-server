var sys = require("sys");
var url = require("url");
var path = require("path");
var fs = require("fs");
var globals = require('./globals.js');

var headers = globals.defaultCorsHeaders;

exports.getMessages = function(request, response){
  console.log("request: " + request+ " -- " + request.method);
  if (request.method === "GET"){
    headers['Content-Type'] = "application/json";
    response.writeHead(200, headers);
    response.write(JSON.stringify(globals.messages));
  }
  if (request.method === "POST"){
    response.writeHead(302, headers);
    request.setEncoding();
    request.on('data', function(data){
      var newItem = JSON.parse(data);
      newItem.createdAt = Date();
      globals.messages.results.push(newItem);
    });
  } 
  response.end();
}

exports.index = function(request, response){
  headers['Content-Type'] = "text/html";
  response.writeHead(200, headers);
  var filename = "./htdoc/index.html";

  fs.readFile(filename, "binary", function(err, file) {
    if(err) {
      console.log("Oh noes!!! No index.");
      return;
    }
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(response);
    return;
  })
}

exports.serveStatic = function(request, response){
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
    var mimeType = globals.mimeTypes[path.extname(filename).split(".")[1]];
    headers['Content-Type'] = mimeType;
    response.writeHead(200, headers);
    var fileStream = fs.ReadStream(filename);
    fileStream.pipe(response);
  } else if (stats.isDirectory()) {
    headers['Content-Type'] = "text";
    response.writeHead(200, headers);
    response.write('Welcome to the ' +uri+' directory.  \n\nIt may or may not have stuff in it.');
    response.end();
  } else {
    console.log('weird... not a file or a directory or unfound...');
    response.end();
  }
}
