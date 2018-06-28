import React from 'react';
import ReactDOM from 'react-dom';
import ReactEventOutside from 'react-event-outside';
// import classnames from 'classnames';
import { FEEDBACK_ROOT_ID, FEEDBACK_EVENTS } from './constants/client';
// import restApi from './rest-api';
import domInitializer from './tool-specific-helpers/dom-initializer';
// import toolInfoCollector from './tool-specific-helpers/tool-info-collector';

import './index.pcss';

// TODO: send a request for the saved previous feedback with activePageName and userName params
verifyTool()
  .then(() => {
    domInitializer.injectSelfUpdatingButtons();
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
        visibility: HIDDEN,
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
