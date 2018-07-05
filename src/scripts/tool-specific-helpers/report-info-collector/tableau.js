import { uuidFromString } from '../../helpers/uuid-generator';
import globals from '../globals';

function getTemplateId() {
  const url = globals.tableau.VizManager.getVizs()[0].getUrl();
  const index = url.lastIndexOf('/');
  const uniqueTemplateName = url.slice(0, index);
  return uuidFromString(uniqueTemplateName);
}

const getPageId = getTemplateId;

export default {
  getTemplateId,
  getPageId,
}
