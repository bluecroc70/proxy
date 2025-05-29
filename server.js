const { createServer } = require('@ultraviolet/server');

const server = createServer({
  handler: async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Proxy requests starting with /stchatango/ to https://st.chatango.com
    if (url.pathname.startsWith('/stchatango/')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      const targetUrl = 'https://st.chatango.com' + url.pathname.replace('/stchatango', '') + url.search;

      return server.proxy(req, res, targetUrl);
    }

    // Proxy requests starting with /chatango/ to https://chatango.com (optional)
    if (url.pathname.startsWith('/chatango/')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      const targetUrl = 'https://chatango.com' + url.pathname.replace('/chatango', '') + url.search;

      return server.proxy(req, res, targetUrl);
    }

    res.statusCode = 404;
    res.end('Not Found');
  },
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Ultraviolet proxy listening on http://localhost:${PORT}`);
});
