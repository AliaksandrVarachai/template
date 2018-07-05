const { API_SETTINGS_LOCAL, FEEDBACK_IS_ABSENT_STATUS_CODE } = require('../scripts/constants/server');

const http = require('http');

const db = {
  'page-uuid': {
    'Denis': {
      "TemplateId": "template-uuid",
      "TemplateName": "qwertySerge",
      "PageId": "page-uuid",
      "PageName": "qwerty1",
      "TemplatePath": "qwerty1",
      "UserName": "Denis",
      "IsLike": true,
      "CreatedDate": "2018-06-28T12:03:26.7393605"
    }
  }
};

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const apiRoute = url.replace(new RegExp(`^${API_SETTINGS_LOCAL.PATH.replace('/', '\/')}\/feedbacks\/?`, 'i'), '');

  if (apiRoute.length === url.length) {
    res.writeHead(400);
    res.end(`route "${url}" is not supported by API server`);
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (method === 'GET') {
    // example: hostname:port/FeedbackTool/api/Feedbacks/37A05CC9-A52C-40A5-91A8-0C328840A6BF/Denis
    const reqParams = new RegExp(`^([^\/]+)\/([^\/]+)$`, 'gi').exec(apiRoute);
    if (reqParams === null) {
      res.writeHead(400);
      res.end();
      return;
    }
    const pageId = reqParams[1];
    const userName = reqParams[2];
    if (!db[pageId] || !db[pageId][userName]) {
      res.writeHead(FEEDBACK_IS_ABSENT_STATUS_CODE, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(`There is no data with pageId="${pageId}" or userName="${userName}`));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db[pageId][userName]));

  } else if (method === 'POST') {
    if (apiRoute === '') {
      let rawFeedback = '';
      req.on('data', chunk => {
        rawFeedback += chunk;
      });
      req.on('end', () => {
        const feedback = JSON.parse(rawFeedback);
        const dbFeedback = {
          ...feedback,
          CreatedDate: new Date().toISOString()
        };
        if (db[feedback.PageId]) {
          db[feedback.PageId][feedback.UserName] = dbFeedback;
        } else {
          db[feedback.PageId] = {
            [feedback.UserName]: dbFeedback
          };
        }
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end();
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(`POST request to "${url}" is not supported`);
    }

  } else if (method === 'OPTIONS') {
    if (apiRoute === '') {
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.writeHead(200);
      res.end();
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(`OPTIONS request to "${url}" is not supported`);
    }

  } else {
    console.log(`Method "${method} is not supported"`)
  }
}).listen(API_SETTINGS_LOCAL.PORT, API_SETTINGS_LOCAL.HOSTNAME);

console.log(`Local API server is started on ${API_SETTINGS_LOCAL.ORIGIN}`)
