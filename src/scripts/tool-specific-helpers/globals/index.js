let globals;

switch (process.env.NODE_TOOL) {
  case 'microstrategy':
    globals = process.env.NODE_IS_LOCAL_START ? require('../../../mocked-data/microstrategy').default : require('./microstrategy').default;
    break;
  case 'tableau':
    globals = process.env.NODE_IS_LOCAL_START ? require('../../../mocked-data/tableau').default : require('./tableau').default;
    break;
  default:
    globals = process.env.NODE_IS_LOCAL_START ? require('../../../mocked-data/default').default : require('./default').default;
}

export default globals;
