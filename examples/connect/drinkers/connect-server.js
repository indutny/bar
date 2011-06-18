name('connect-server');

var connect = require('connect'),
    router = connect.router(function(app) {
      process.nextTick(function() {
        snap('connect.router', router, app);
      });
    }),
    server = connect.createServer(router);

server.listen(8081);

on('leave.connect-server', function(callback) {
  server.close(callback);
});
