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
    const message = JSON.parse(record.body);
    console.log(message);
    return Promise.resolve(null);
}
