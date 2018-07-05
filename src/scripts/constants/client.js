/**
 * Id of DOM element containing feedback tool form.
 * @type {string}
 */
export const FEEDBACK_ROOT_ID = 'feedback-root';

/**
 * Pairs of listened events and relevant DOM attributes.
 * @type {{string: string}}
 */
export const FEEDBACK_EVENTS = {
  'change': 'feedback-onchange',
};

/**
 * State of user's feedback.
 * @type {{NOT_SELECTED: string, POSITIVE: string, NEGATIVE: string}}
 */
export const FEEDBACK_STATE = {
  NOT_SELECTED: '0',
  POSITIVE: '1',
  NEGATIVE: '2'
};