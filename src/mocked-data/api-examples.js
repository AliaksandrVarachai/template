// Example of GET request to get request from the DB:
const getRequest = `http://ecsb00100b6f.epam.com/FeedbackTool/api/Feedbacks/${PageId}/${UserName}`;
const getResponse = {
  "TemplateId": "template-uuid",
  "TemplateName": "qwertySerge",
  "PageId": "page-uuid",
  "PageName": "qwerty1",
  "TemplatePath": "qwerty1",
  "UserName": "Denis",
  "IsLike": true,
  "CreatedDate": "2018-06-28T12:03:26.7393605"
};

// Example of POST request to send request to the DB:
const postRequest = 'http://ecsb00100b6f.epam.com/FeedbackTool/api/Feedbacks';
const requestBody = {
  TemplateId: "template-uuid",
  TemplateName: "qwertySerge",
  PageId: "page-uuid",
  PageName: "qwerty1",
  TemplatePath: "qwerty1",
  UserName: "Denis",
  IsLike: true
};
const responseBody = '';
