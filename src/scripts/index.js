import React from 'react';
import ReactDOM from 'react-dom';
import ReactEventOutside from 'react-event-outside';
// import classnames from 'classnames';
import { FEEDBACK_ROOT_ID, FEEDBACK_EVENTS, FEEDBACK_STATE } from './constants/client';
import restApi from './rest-api';
import domInitializer from './tool-specific-helpers/dom-initializer';
// import toolInfoCollector from './tool-specific-helpers/tool-info-collector';
import verifyTool from './tool-specific-helpers/verifiers';

import './index.pcss';

// TODO: send a request for the saved previous feedback with activePageName and userName params
verifyTool()
  .then(() => {
    // TODO: replace mocked data
    const pageId = '37A05CC9-A52C-40A5-91A8-0C328840A6BF';
    const userName = 'Denis';
    return restApi.getFeedback(pageId, userName);
  })
  .then(feedback => {
    let feedbackState = FEEDBACK_STATE.NOT_SELECTED;
    if (feedback !== null)
      feedbackState = feedback.IsLike ? FEEDBACK_STATE.POSITIVE : FEEDBACK_STATE.NEGATIVE;
    domInitializer.injectSelfUpdatingButtons(feedbackState);
    renderFeedbackRootElement();
  })
  .catch(error => {
    console.log(error.message);
  });


function renderFeedbackRootElement() {
  class Popup extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        // TODO: show data in popup with GET: /api/feedbacks/page/{pageId}/user/{Username}
        // TemplateId - GUID
        // TemplateName - String
        // PageId - GUID
        // Page name - String
        // TemplatePath - String
        // Username - String
        // IsLike - Boolean
        // CreatedDate - DateTime
      };
      this.isResponseWaiting = false; // blocks sending of a feedback request until the previous one is resolved
      this.formerClickedFeedback = FEEDBACK_STATE.NOT_SELECTED; // stores the state before the AJAX feedback request
      this.latterClickedFeedback = FEEDBACK_STATE.NOT_SELECTED; // stores the state with the latter user's choice
    }

    handleEvent = (event) => {
      Object.keys(FEEDBACK_EVENTS).forEach(feedbackEvent => {
        if (event.type !== feedbackEvent)
          return;
        const eventOutsideName = event.target.getAttribute(FEEDBACK_EVENTS[feedbackEvent]);
        if (!eventOutsideName)
          return;
        switch(eventOutsideName) {
          case 'positiveFeedback':
            this.latterClickedFeedback = FEEDBACK_STATE.POSITIVE;
            if (!this.isResponseWaiting) {
              this.sendOnlyLatterFeedback(true);
            }
            break;
          case 'negativeFeedback':
            this.latterClickedFeedback = FEEDBACK_STATE.NEGATIVE;
            if (!this.isResponseWaiting) {
              this.sendOnlyLatterFeedback(false);
            }
            break;
          default:
            console.log(`There is no event handler for "${eventOutsideName}"`);
        }
      });
    };

    sendOnlyLatterFeedback(feedbackState) {
      function _sendFeedback(feedbackState, isFirst = false) {
        if (isFirst) {
          this.isResponseWaiting = true;
          this.formerClickedFeedback = this.latterClickedFeedback;
        }
        return new Promise(resolve => {
          restApi.sendFeedback(feedbackState).then(() => {
            // check if a user changed the feedback state during the AJAX request
            if (this.formerClickedFeedback === this.latterClickedFeedback) {
              // feedback state is relevant
              resolve(null);
              this.isResponseWaiting = false;
              console.log(`${feedbackState ? 'Positive': 'Negative'} feedback is saved to the DB`);
            } else {
              // feedback state is not relevant
              this.formerClickedFeedback = this.latterClickedFeedback;
              _sendFeedback.call(this, this.latterClickedFeedback === FEEDBACK_STATE.POSITIVE);
            }
          });
        });
      }

      _sendFeedback.call(this, feedbackState, true);
    }

    render() {
      return (
        <div style={{display: 'none'}}/>
      );
    }
  }

  const feedbackRoot = document.createElement('div');
  feedbackRoot.id = FEEDBACK_ROOT_ID;
  document.body.appendChild(feedbackRoot);
  const InitializedPopup = ReactEventOutside(Object.keys(FEEDBACK_EVENTS))(Popup);
  ReactDOM.render(<InitializedPopup/>, feedbackRoot);
}
