const { API_SETTINGS_LOCAL } = require('../scripts/constants/server');

const http = require('http');

const db = {
  '37a05cc9-c52c-40a5-91c8-0c328840c6bf': {
    'Denis': {
      "TemplateId": "37a05cc9-c52c-40a5-91c8-0c328840c6bf",
      "TemplateName": "qwertySerge",
      "PageId": "37a05cc9-a52c-40a5-91a8-0c328840a6bf",
      "PageName": "qwerty1",
      "TemplatePath": "qwerty1",
      "UserName": "Denis",
      "IsLike": true,
      "CreatedDate": "2018-06-28T12:03:26.7393605"
    }
  }
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // example: http://hostname:port/FeedbackTool/api/Feedbacks/37A05CC9-A52C-40A5-91A8-0C328840A6BF/Denis
    const reqParams = new RegExp(`${API_SETTINGS_LOCAL.path}\/([^\/]+)\/([^\/]+)$`, 'gi').exec(req.path);
    if (reqParams === null) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(`Wrong path "${req.path}"`));
      return;
    }
    const pageId = reqParams[1];
    const userName = reqParams[2];
    if (!db[pageId] || !db[pageId][userName]) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(`There is no data with pageId="${pageId}" or userName="${userName}`));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db[pageId][userName]));
  } else if (req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('POST request is received');
  } else {
    console.log(`Method "${req.method} is not supported"`)
  }
}).listen(API_SETTINGS_LOCAL.PORT, API_SETTINGS_LOCAL.HOSTNAME);

console.log(`Local API server is started on ${API_SETTINGS_LOCAL.ORIGIN}`)
