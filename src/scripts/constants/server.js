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
 * @type {{NAME: string, PORT: number}}
 */
const API_SETTINGS_LOCAL = {
  PROTOCOL: 'http',
  NAME: 'localhost',
  PORT: 9093,
  PATH: API_SETTINGS.PATH
};
API_SETTINGS_LOCAL.ORIGIN = `${API_SETTINGS_LOCAL.PROTOCOL}://${API_SETTINGS_LOCAL.NAME}:${API_SETTINGS_LOCAL.PORT}`;

module.exports = {
  API_SETTINGS,
  API_SETTINGS_LOCAL,
};
