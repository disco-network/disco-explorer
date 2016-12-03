var static = require('node-static'),
  http = require('http'),
  util = require('util');

var webroot = __dirname, host = "disco-node.local", port = 3333;
console.log(webroot);

var file = new static.Server(webroot);

http.createServer((req, res) => {
  req.addListener('end', () => {
    file.serve(req, res);
  }).resume();
}).listen(port, host);

console.log('node-static running at %s:%d', host, port);