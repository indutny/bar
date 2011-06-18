name('index-page');

function requestHandler(req, res) {
  res.writeHead(200);
  res.end('hehey! 123');
};

waitFor('http', function() {
  snap('http.request', requestHandler);
});

on('leave.index-page', function() {
  emit('http.removeHandler', requestHandler);
});
