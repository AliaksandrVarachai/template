/**
 * Backend API settings.
 * @type {{ORIGIN: string, PATH: string}}
 */
export const API_SETTINGS = {
  // TODO: replace fake API params with real ones
  ORIGIN: 'http://ecsb00100b6f.epam.com',
  PATH: '/FeedbackTool/api'
};

/**
 * Settings for local test of the application.
 * @type {{ORIGIN: string, PATH: number}}
 */
const API_SETTINGS_LOCAL = {
  ORIGIN: 'http://localhost:9093',
  PATH: API_SETTINGS.PATH
};

module.exports = {
  API_SETTINGS,
  API_SETTINGS_LOCAL,
};
