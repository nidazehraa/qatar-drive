import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

import { tableName, fromEmail } from './config';

AWS.config.update({
    region: 'eu-central-1'
});
const ses = new AWS.SES()

export function handler(event, context, callback) {
    const response = {
       statusCode: 200,
       body: JSON.stringify({
         message: 'Success!',
       }),
     };
    addAppointment(event)
    .then(() => callback(null, response))
    .catch(callback);
}

async function addAppointment(record) {
    if (!record || !record.body) {
        throw new Error('Invalid event');
    }
    const eventData = JSON.parse(record.body);
    if (!eventData) {
        throw new Error('Invalid event');
    }
    await save(eventData);
}

async function save(data) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const messageInfo = {
        TableName: tableName,
        Item: { id: uuid(), ...data }
    };
    return new Promise((resolve, reject) => {
        dynamoDb.put(messageInfo, (error, response) => {
            if (error) {
                return reject(error);
            }
            resolve(null);
        });
    }).then(async () => await sendEmail(data));

}

async function sendEmail(userData) {
 const emailTemplate = {
    Source: fromEmail,
    Destination: { ToAddresses: [userData.email] },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `You've booked an appointment at ${userData.timedate}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You've booked an appointment!`
      }
    }
  }
  await ses.sendEmail(emailTemplate).promise();
}
