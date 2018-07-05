import { LOCAL_TEST_TEMPLATE_ID, LOCAL_TEST_PAGE_ID } from '../../../mocked-data/constants'
let reportInfo;

const mockedReportInfo = {
  getTemplateId: () => LOCAL_TEST_TEMPLATE_ID,
  getPageId: () => LOCAL_TEST_PAGE_ID,
};

switch (process.env.NODE_TOOL) {
  case 'tableau':
    reportInfo = require('./tableau');
    break;
  default:
    throw Error(`process.env.NODE_TOOL contains wrong value "${process.env.NODE_TOOL}"`);
}

export default process.env.NODE_IS_STARTED_LOCALLY ? { ...mockedReportInfo } : { ...reportInfo.default };
