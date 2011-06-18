name('index-page');

function requestHandler(req, res) {
  if (req.url == '/') {
    res.writeHead(200);
    res.end('hehey! 12345');
  }
};

snap('http.request', requestHandler);

on('leave.index-page', function() {
  emit('http.removeHandler', requestHandler);
});
