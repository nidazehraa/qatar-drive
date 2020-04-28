import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

import { tableName } from './config';

AWS.config.update({
    region: 'eu-central-1'
});

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

function save(data) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const messageInfo = {
        TableName: tableName,
        Item: { id: uuid(), message: data.name }
    };
    return new Promise((resolve, reject) => {
        dynamoDb.put(messageInfo, (error, response) => {
            if (error) {
                return reject(error);
            }
            resolve(null);
        });
    });
}
