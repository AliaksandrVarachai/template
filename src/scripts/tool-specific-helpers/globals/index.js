let globals;

switch (process.env.NODE_TOOL) {
  case 'tableau':
    globals = process.env.NODE_IS_STARTED_LOCALLY ? require('../../../mocked-data/tableau') : require('./tableau');
    break;
  default:
    throw Error(`process.env.NODE_TOOL contains wrong value "${process.env.NODE_TOOL}"`);
}

export default globals.default;
