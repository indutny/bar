name('stub-page');

function requestHandler(req, res) {
  if (req.url == '/stub') {
    res.writeHead(302, {
      Location: '/'
    });
    res.end('');
  }
};

snap('http.request', requestHandler);

on('leave.stub-page', function() {
  emit('http.removeHandler', requestHandler);
});
