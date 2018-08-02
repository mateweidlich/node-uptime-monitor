// dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

// own dependencies
const config = require('./lib/config');
const helpers = require('./lib/helpers');
const handlers = require('./lib/handlers');

//http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});
httpServer.listen(config.httpPort, () => {
  console.log(`HTTP server is running on port ${config.httpPort}`);
});

// https server
const httpsServer = https.createServer(
  {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
  },
  (req, res) => {
    unifiedServer(req, res);
  }
);
httpsServer.listen(config.httpsPort, () => {
  console.log(`HTTPS server is running on port ${config.httpsPort}`);
});

// server
const unifiedServer = (req, res) => {
  const method = req.method.toLowerCase();

  const headers = req.headers;

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const query = parsedUrl.query;

  const decoder = new StringDecoder('utf8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', async () => {
    buffer += decoder.end();

    // check if path exists in router
    const handler = path in router ? router[path] : handlers.notFound;
    const [statusCode = 200, payload = {}] = await handler({
      method,
      headers,
      path,
      query,
      payload: helpers.parseJsonToObject(buffer)
    });

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(payload));
  });
};

// router
const router = {
  ping: handlers.ping,
  users: handlers.users
};
