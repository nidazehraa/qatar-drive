import * as _ from 'lodash';

export function handler(event, context, callback) {
    const response = {
       statusCode: 200,
       body: JSON.stringify({
         message: 'Success!',
       }),
     };
    saveAndSendMessage(event)
    .then(() => callback(null, response))
    .catch(callback);
}

async function saveAndSendMessage(record) {
    const eventData = getEventData(record.body);
    console.log(eventData);
    return Promise.resolve(null);
}

function getEventData(event) {
    const message = JSON.parse(event);
    return _.get(message, 'event-data');
}
