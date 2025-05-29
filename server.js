const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function(req, res) {
  if (req.url.startsWith('/stchatango/')) {
    req.url = req.url.replace('/stchatango', '');

    proxy.web(req, res, { target: 'https://st.chatango.com', changeOrigin: true }, (e) => {
      res.writeHead(502);
      res.end('Proxy error');
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
