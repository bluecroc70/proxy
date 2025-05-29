const { createServer } = require('@ultraviolet/server');

const server = createServer({
  // This config object controls proxy behavior
  handler: async (req, res) => {
    // By default, it proxies everything to the target host.
    // We want to proxy requests for Chatango.
    
    // Extract URL path from req.url
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Check if request is for Chatango
    if (url.pathname.startsWith('/chatango/')) {
      // Strip /chatango/ prefix, then forward to Chatango
      const targetUrl = 'https://chatango.com' + url.pathname.replace('/chatango', '') + url.search;

      // You can use Ultraviolet's proxy helper:
      return server.proxy(req, res, targetUrl);
    }

    // For other requests, just respond with 404
    res.statusCode = 404;
    res.end('Not Found');
  },
});

server.listen(3000, () => {
  console.log('Ultraviolet proxy running on http://localhost:3000');
});
