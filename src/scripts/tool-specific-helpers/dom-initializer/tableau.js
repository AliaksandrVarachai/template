import globals from '../../tool-specific-helpers/globals';

export default function() {
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

  const firstChild = parentButtonStartNode.firstChild;
  const positiveFeedbackButton = createCustomViewButton(positiveFeedbackButtonId, '+1', 'positiveFeedback');
  const negativeFeedbackButton = createCustomViewButton(negativeFeedbackButtonId, '-1', 'negativeFeedback');

  parentButtonStartNode.insertBefore(negativeFeedbackButton, firstChild);
  parentButtonStartNode.insertBefore(positiveFeedbackButton, firstChild);
}


function createCustomViewButton(btnId, text, clickEventName) {
  const btn = document.createElement('div');
  btn.id = btnId;
  btn.setAttribute('class', 'tabToolbarButton tab-widget customviews');
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Custom views');
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('style', 'position: relative; user-select: none; -webkit-tap-highlight-color: transparent; width: 115px !important;-ms-transform: translateY(-35%)');
  btn.innerHTML = `<div feedback-onclick="${clickEventName}" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;"></div>` +
    `<span class="tabToolbarButtonImg tab-icon-edit"></span><span class="tabToolbarButtonText">${text}</span>`;
  return btn;
}
