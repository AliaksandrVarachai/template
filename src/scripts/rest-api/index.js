import { API_SETTINGS, API_SETTINGS_LOCAL, FEEDBACK_IS_ABSENT_STATUS_CODE } from '../constants/server';

const API_PREFIX = process.env.NODE_IS_MOCK_API_SERVER
  ? `${API_SETTINGS.ORIGIN}${API_SETTINGS.PATH}`
  : `${API_SETTINGS_LOCAL.ORIGIN}${API_SETTINGS_LOCAL.PATH}`;


/**
 * Constructor for custom error object overriding message field with custom data.
 * @param {Response} response - XMLHttpRequest object that contains data about happened error.
 * @constructor
 */
function ResponseError(response) {
  this.message = `${response.status}: ${response.statusText}`;
}

ResponseError.prototype = Object.create(Error.prototype);


/**
 * Processes a response and provides data from its body.
 * @param {object} response - a response object.
 * @returns {object|null} - a js object formed from response body or null when: a) the feedback is absent; b) the response body is empty
 * @throws {error} - status and description of an error.
 */
function getJsonFromResponse(response) {
  if (response.ok) {
    return response.text()
      .then(text => text.length ? JSON.parse(text) : null);
  } else if (response.status === FEEDBACK_IS_ABSENT_STATUS_CODE) {
    return null; // empty response body when there is not feedback in the DB
  }
  throw new ResponseError(response);
}

/**
 * Sends a get request to the server.
 * @param {string} api - api url.
 * @returns {Promise<object|null>}
 * @throws {error} - status and description of an error.
 */
function get(api) {
  const options = {
    headers: new Headers({'Accept': 'application/json'})
  };
  return fetch(`${API_PREFIX}${api}`, options)
    .then(response => getJsonFromResponse(response));
}

/**
 * Sends a post request to the server.
 * @param {string} api - api url.
 * @param {object} body - object to be sent in the body of a request.
 * @param {object} [headers={}] - object of request headers.
 * @param {string} [credentials='same-origin'] - object to be sent in the body of a request.
 * @param {string} [apiPrefix] - prefixed API origin and pathname of the request.
 * @returns {Promise<object|null>} - a js object formed from response body.
 * @throws {error} - status and description of the error.
 */
function post(api, {body, headers = {}, credentials = 'same-origin', apiPrefix = API_PREFIX}) {
  const _options = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }),
    method: 'POST',
    body: JSON.stringify(body),
    credentials,
  };
  return fetch(`${apiPrefix}${api}`, _options)
    .then(response => getJsonFromResponse(response));
}

/**
 * Sends a feedback to the server.
 * @param {boolean} isLike - user's feedback.
 * @returns {Promise<object|null>} - response from server or null if there is not any data in response body.
 * @throws {error} - status and description of the error.
 */
function sendFeedback(isLike) {
  // TODO: replace mocked data
  const body = {
    TemplateId: "template-uuid",
    TemplateName: "qwertySerge",
    PageId: "37A05CC9-A52C-40A5-91A8-0C328840A6BF",
    PageName: "qwerty1",
    TemplatePath: "qwerty1",
    UserName: "Denis",
    IsLike: isLike
  };
  return post('/feedbacks', { body });
}

/**
 * Gets a feedback object form the server.
 * @param {string} pageId - uuid of page.
 * @param {string} userName - user's login.
 * @returns {Promise.<Object|null>}
 */
function getFeedback(pageId, userName) {
  return get(`/feedbacks/${pageId}/${userName}`);
}


export default {
  get,
  post,
  sendFeedback,
  getFeedback,
}
