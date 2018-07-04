const { API_SETTINGS_LOCAL } = require('../scripts/constants/server');

const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('Get request is received');
  } else if (req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('POST request is received');
  } else {
    console.log(`Method "${req.method} is not supported"`)
  }
}).listen(API_SETTINGS_LOCAL.PORT, API_SETTINGS_LOCAL.HOSTNAME);

console.log(`Local API server is started on ${API_SETTINGS_LOCAL.ORIGIN}`)
