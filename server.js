const { createServer } = require('@ultraviolet/server');

const server = createServer({
  handler: async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Proxy anything under /chatango/ to https://chatango.com
    if (url.pathname.startsWith('/chatango/')) {
      // CORS headers to allow frontend fetches
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      // Build target URL to Chatango by removing /chatango prefix
      const targetUrl = 'https://chatango.com' + url.pathname.replace('/chatango', '') + url.search;

      // Proxy HTTP or WebSocket request to Chatango
      return server.proxy(req, res, targetUrl);
    }

    res.statusCode = 404;
    res.end('Not Found');
  },
});

server.listen(3000, () => {
  console.log('Ultraviolet proxy listening on http://localhost:3000');
});
