name('page-router');

var router;
hook('connect.router', function(_router, app) {
  router = _router;
  app.get('/', function(req, res) {
    res.writeHead(200);
    res.end('hello world!');
  });

  app.get('/bar', function(req, res) {
    res.writeHead(200);
    res.end('bar!');
  });
});

on('leave.pages', function() {
  if (!router) return;
  router.remove('/');
});
