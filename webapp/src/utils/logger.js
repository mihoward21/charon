const amplitude = require('amplitude-js');


export const logEvent = (eventType, eventProperties) => {
    eventProperties['url'] = window.location.href;
    amplitude.getInstance().logEvent(eventType, eventProperties);
};
