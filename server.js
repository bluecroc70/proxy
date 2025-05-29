const { createServer } = require('@ultraviolet/server');

const server = createServer({
  handler: async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Proxy requests starting with /tawkto/ to https://tawk.to
    if (url.pathname.startsWith('/tawkto/')) {
      // Set CORS headers to allow your frontend to fetch
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      // Build target URL for tawk.to by stripping /tawkto prefix
      const targetUrl = 'https://tawk.to' + url.pathname.replace('/tawkto', '') + url.search;

      // Proxy request to tawk.to
      return server.proxy(req, res, targetUrl);
    }

    // If not matched, 404
    res.statusCode = 404;
    res.end('Not Found');
  },
});

server.listen(3000, () => {
  console.log('Ultraviolet proxy running on http://localhost:3000');
});
