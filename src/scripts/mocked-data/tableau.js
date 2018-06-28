import { findIndexByProperty } from '../scripts/helpers/array-operations';

const DELAY_BEFORE_FIRST_EVENT_DISPATCH = 1500;
const tableau = window.parent.tableau || {};

tableau.VizManager = {
  getVizs
};

const visuals = [
  { getWorkbook }
];

function getVizs() {
  return visuals;
}

/** Begin of event section */

const events = {};
const visual = tableau.VizManager.getVizs()[0];

visual.dispatchEvent = function(eventName) {
  if (events[eventName] && events[eventName] instanceof Array) {
    events[eventName].forEach(cb => cb());
  } else {
    console.warn(`There are no listeners for dispatched event "${eventName}"` +
      '\nIt is possible that mocked Tableau events are dispatched before any listener is added.' +
      '\nTry to fix it with DELAY_BEFORE_FIRST_EVENT_DISPATCH');
  }
};

visual.addEventListener = function(eventName, cb) {
  if (events[eventName]) {
    events[eventName].push(cb);
  } else {
    events[eventName] = [cb];
  }
};

visual.removeEventListener = function(eventName, cb) {
  if (events[eventName]) {
    const inx = events[eventName].indexOf(cb);
    if (inx > -1) {
      events[eventName].splice(inx, 1);
      if (events[eventName].length === 0)
        events[eventName] = null;
    } else {
      console.warn(`Event "${eventName}" does not have the removed listener`);
    }
  } else {
    console.warn(`There is no event "${eventName}" so the listener is not removed`);
  }
};

if(document.readyState === 'interactive') {
  dispatchOnLoadAndSubscribeOnClick();
} else {
  document.addEventListener('DOMContentLoaded',  e => {
    dispatchOnLoadAndSubscribeOnClick();
  });
}

function dispatchOnLoadAndSubscribeOnClick() {
  setTimeout(dispatchCustomViewLoadEvent, DELAY_BEFORE_FIRST_EVENT_DISPATCH); // simulates event when dynamic DOM is loaded (only for the 1st load)
  setTimeout(dispatchToolbarStateChangeEvent, DELAY_BEFORE_FIRST_EVENT_DISPATCH);
  document.onclick = function(event) {
    if (event.target.classList.contains('tabLabel')) {
      const newSheetName = event.target.getAttribute('value');
      setTimeout(dispatchTabSwitch.bind(null, newSheetName), 500); // simulates event when dynamic DOM is loaded (when tab is switched by user)
      setTimeout(dispatchToolbarStateChangeEvent, 1000); // simulates event when dashboard buttons are updated
    }
  };
}

tableau.TableauEventName = {
  TOOLBAR_STATE_CHANGE: 'TOOLBAR_STATE_CHANGE',
  CUSTOM_VIEW_LOAD: 'CUSTOM_VIEW_LOAD',
  TAB_SWITCH: 'TAB_SWITCH'
};

function dispatchCustomViewLoadEvent() {
  visual.dispatchEvent(tableau.TableauEventName.CUSTOM_VIEW_LOAD);
}

function dispatchToolbarStateChangeEvent() {
  visual.dispatchEvent(tableau.TableauEventName.TOOLBAR_STATE_CHANGE);
}

function dispatchTabSwitch(sheetName) {
  changeActiveSheet(sheetName);
  visual.dispatchEvent(tableau.TableauEventName.TAB_SWITCH);
}

/** End of event section */

function getWorkbook() {
  return {
    getActiveSheet,
    getPublishedSheetsInfo,
    activateSheetAsync,
  };
}

const sheetNodes = document.querySelectorAll('.tabLabel');
const SHEETS = Array.prototype.map.call(sheetNodes, sheetNode => new Sheet({name: sheetNode.getAttribute('value')}));
let activeSheetName = SHEETS[0].name;

function changeActiveSheet(sheetName) {
  const inx = findIndexByProperty(SHEETS, 'name', sheetName);
  if (inx < 0)
    throw Error(`Active sheet "${sheetName}" is not found in SHEET array`);
  activeSheetName = sheetName;
}

function getActiveSheet() {
  return {
    getName: () => activeSheetName
  };
}

function getPublishedSheetsInfo() {
  return SHEETS;
}

function activateSheetAsync(sheetName) {
  // DDM is ready only after TAB_SWITCH event;
  setTimeout(dispatchTabSwitch(sheetName), 500);
  return findIndexByProperty(SHEETS, 'name', sheetName) > -1 ? Promise.resolve() : Promise.reject(`No "${sheetName}" in SHEET array`);
}

function Sheet({ name }) {
  this.name = name;
}

Sheet.prototype.getName = function() {
  return this.name;
};

export default {
  tableau
}
