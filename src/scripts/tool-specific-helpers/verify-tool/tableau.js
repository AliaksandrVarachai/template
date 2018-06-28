import globals from '../globals';

/**
 * Verifies the tool-specific data before Guided Tour is initialized.
 * @returns {Promise} - a promise that returns null if resolved and throws Error if rejected.
 */
export default function() {
  if (globals.tableau && globals.tableau.VizManager) {
    return Promise.resolve(null);
  } else {
    return Promise.reject(new Error('Global objects "tableau" or "tableau.VizManager" are not specified.'));
  }
}
