import globals from '../globals';
import { FEEDBACK_STATE } from '../../constants/client';

let feedbackState = FEEDBACK_STATE.NOT_SELECTED;

function injectSelfUpdatingButtons(_feedbackState) {
  feedbackState = _feedbackState;
  const visualFrame = globals.tableau.VizManager.getVizs()[0];

  function cbCustomViewLoad() {
    visualFrame.removeEventListener(globals.tableau.TableauEventName.CUSTOM_VIEW_LOAD, cbCustomViewLoad);
  }

  function cbTabSwitch() {
    // TODO: uncomment or replace TAB_SWITCH callback listener
    // addFeedbackButtonsToDocument()
    console.log('TAB_SWITCH callback is launched');
  }

  visualFrame.addEventListener(globals.tableau.TableauEventName.TOOLBAR_STATE_CHANGE, addFeedbackButtonsToDocument);
  visualFrame.addEventListener(globals.tableau.TableauEventName.CUSTOM_VIEW_LOAD, FULL_SCREEN_ADD_BUTTON_FIX);
  visualFrame.addEventListener(globals.tableau.TableauEventName.CUSTOM_VIEW_LOAD, cbCustomViewLoad);
  visualFrame.addEventListener(globals.tableau.TableauEventName.TAB_SWITCH, cbTabSwitch);

}

function FULL_SCREEN_ADD_BUTTON_FIX() {
  const tabNonVizItem = document.querySelector('.tab-toolbar-container .tab-nonVizItems') //v10.3
    || document.querySelector('#toolbar-container .tab-nonVizItems'); //v10.4 and 10.5

  tabNonVizItem.addEventListener('click', (e) => {
    if(tabNonVizItem.classList.contains('hideLabels')){
      setTimeout(addFeedbackButtonsToDocument, 1000);
    }
  });
}


function addFeedbackButtonsToDocument() {
  const positiveFeedbackButtonId = 'feedback-positive-button';
  const negativeFeedbackButtonId = 'feedback-negative-button';
  const feedbackClassNamePrefix = 'feedback'; // must be the same as in CSS rules
  const feedbackIdPrefix = 'feedback';
  const feedbackRadioGroupName = feedbackIdPrefix;

  const parentButtonStartNode = document.querySelector('.tab-toolbar-container .tab-nonVizItems') //v10.3
    || document.querySelector('#toolbar-container .tab-nonVizItems'); //v10.4 and 10.5

  if(parentButtonStartNode.querySelector(`#${positiveFeedbackButtonId}`)) {
    return;
  }

  const positiveFeedbackButton = createCustomViewButton(positiveFeedbackButtonId);
  const negativeFeedbackButton = createCustomViewButton(negativeFeedbackButtonId);

  // Positive feedback button content
  const positiveFeedbackRadio = document.createElement('input');
  positiveFeedbackRadio.type = 'radio';
  positiveFeedbackRadio.name = feedbackRadioGroupName;
  positiveFeedbackRadio.id = `${feedbackIdPrefix}__up`;
  positiveFeedbackRadio.setAttribute('class', `${feedbackClassNamePrefix}__radio`);
  positiveFeedbackRadio.checked = feedbackState === FEEDBACK_STATE.POSITIVE;
  positiveFeedbackRadio.setAttribute('feedback-onchange', 'positiveFeedback');

  const positiveFeedbackLabel = document.createElement('label');
  positiveFeedbackLabel.htmlFor = positiveFeedbackRadio.id;
  positiveFeedbackLabel.setAttribute('class', `material-icons ${feedbackClassNamePrefix}__label ${feedbackClassNamePrefix}__positive`);
  positiveFeedbackLabel.innerHTML='thumb_up';

  positiveFeedbackButton.appendChild(positiveFeedbackRadio);
  positiveFeedbackButton.appendChild(positiveFeedbackLabel);

  // Negative feedback button content
  const negativeFeedbackRadio = document.createElement('input');
  negativeFeedbackRadio.type = 'radio';
  negativeFeedbackRadio.name = feedbackRadioGroupName;
  negativeFeedbackRadio.id = `${feedbackIdPrefix}__down`;
  negativeFeedbackRadio.setAttribute('class', `${feedbackClassNamePrefix}__radio`);
  negativeFeedbackRadio.checked = feedbackState === FEEDBACK_STATE.NEGATIVE;
  negativeFeedbackRadio.setAttribute('feedback-onchange', 'negativeFeedback');

  const negativeFeedbackLabel = document.createElement('label');
  negativeFeedbackLabel.htmlFor = negativeFeedbackRadio.id;
  negativeFeedbackLabel.setAttribute('class', `material-icons ${feedbackClassNamePrefix}__label ${feedbackClassNamePrefix}__negative`);
  negativeFeedbackLabel.innerHTML='thumb_down';

  negativeFeedbackButton.appendChild(negativeFeedbackRadio);
  negativeFeedbackButton.appendChild(negativeFeedbackLabel);

  // Adding feedback buttons to DOM
  const firstChild = parentButtonStartNode.firstChild;
  parentButtonStartNode.insertBefore(negativeFeedbackButton, firstChild);
  parentButtonStartNode.insertBefore(positiveFeedbackButton, firstChild);
}


function createCustomViewButton(btnId) {
  const btn = document.createElement('div');
  btn.id = btnId;
  btn.setAttribute('class', 'tabToolbarButton tab-widget customviews');
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Feedback');
  btn.setAttribute('style', 'vertical-align: top; padding-top: 4px;');
  return btn;
}

export default {
  injectSelfUpdatingButtons,
}
