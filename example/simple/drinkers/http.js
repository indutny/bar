name('http');

var http = require('http');

var server = http.createServer();

hook('http.request', function(fn) {
  server.on('request', fn);
});
server.listen(8082);

on('http.removeHandler', function(event, handler) {
  server.removeListener('request', handler);
});

on('leave.http', function(callback) {
  server.close(callback);
});
