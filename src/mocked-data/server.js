const { API_SETTINGS_LOCAL } = require('../scripts/constants/server');

const http = require('http');

const server = http.createServer((req, res) => {
  switch(req.method) {
    case 'GET':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('Get request is received');
      break;
    case 'POST':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('POST request is received');
      break;
    default:
      // nothing
  }


}).listen(API_SETTINGS_LOCAL.PORT, API_SETTINGS_LOCAL.HOSTNAME);

console.log(`Local API server is started on ${API_SETTINGS_LOCAL.ORIGIN}`)
