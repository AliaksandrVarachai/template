let verifyTool;

switch (process.env.NODE_TOOL) {
  case 'tableau':
    verifyTool = require('./tableau');
    break;
  default:
    throw Error(`process.env.NODE_TOOL contains wrong value "${process.env.NODE_TOOL}"`);
}

export default verifyTool.default;
