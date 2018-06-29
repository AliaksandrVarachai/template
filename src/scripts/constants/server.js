/**
 * Backend API settings.
 * @type {{ORIGIN: string, PATH: string}}
 */
const API_SETTINGS = {
  // TODO: replace fake API params with real ones
  ORIGIN: 'http://ecsb00100b6f.epam.com',
  PATH: '/FeedbackTool/api'
};

/**
 * Settings for local test of the application.
 * @type {{HOST: string, ORIGIN: string, PATH: number}}
 */
const API_SETTINGS_LOCAL = {
  HOSTNAME: 'localhost',
  PORT: '9093',
  PATH: API_SETTINGS.PATH
};
API_SETTINGS_LOCAL.ORIGIN = `http://${API_SETTINGS_LOCAL.HOSTNAME}:${API_SETTINGS_LOCAL.PORT}`;


module.exports = {
  API_SETTINGS,
  API_SETTINGS_LOCAL,
};
