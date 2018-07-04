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
    const pageId = '37a05cc9-c52c-40a5-91c8-0c328840c6bf';
    const userName = 'Denis';
    return restApi.getFeedback(pageId, userName);
  })
  .then(feedback => {
    console.log('feedback=', feedback);
    let feedbackState = FEEDBACK_STATE.NOT_SELECTED; // TODO: move to upper state and set as a default state
    if (feedback.isLike) {
      feedbackState = FEEDBACK_STATE.POSITIVE;
    } else {
      feedbackState = FEEDBACK_STATE.NEGATIVE;
    }
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
            console.log('Positive feedback is given');
            break;
          case 'negativeFeedback':
            console.log('Negative feedback is given');
            break;
          default:
            console.log(`There is no event handler for "${eventOutsideName}"`);
        }
      });
    };

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
