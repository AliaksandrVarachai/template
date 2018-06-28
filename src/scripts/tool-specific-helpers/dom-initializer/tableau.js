import globals from '../../tool-specific-helpers/globals';

function injectSelfUpdatingButtons() {
  const visualFrame = globals.tableau.VizManager.getVizs()[0];

  function cbCustomViewLoad() {
    visualFrame.removeEventListener(globals.tableau.TableauEventName.CUSTOM_VIEW_LOAD, cbCustomViewLoad);
  }

  function cbTabSwitch() {
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

  const parentButtonStartNode = document.querySelector('.tab-toolbar-container .tab-nonVizItems') //v10.3
    || document.querySelector('#toolbar-container .tab-nonVizItems'); //v10.4 and 10.5

  if(parentButtonStartNode.querySelector(`#${positiveFeedbackButtonId}`)) {
    return;
  }

  const positiveFeedbackButton = createCustomViewButton(positiveFeedbackButtonId);
  const negativeFeedbackButton = createCustomViewButton(negativeFeedbackButtonId);

  positiveFeedbackButton.innerHTML =
    `<input type="radio" name="feedback" id="feedback__up" class="feedback__radio">` +
    `<label for="feedback__up" feedback-onclick="positiveFeedback" class="material-icons feedback__label feedback__positive">thumb_up</label>`;

  negativeFeedbackButton.innerHTML =
    `<input type="radio" name="feedback" id="feedback__down" class="feedback__radio">` +
    `<label for="feedback__down" feedback-onclick="negativeFeedback" class="material-icons feedback__label feedback__negative">thumb_down</label>`;

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
