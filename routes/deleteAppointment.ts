import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

import { tableName } from './config';
import { DeleteItemInput } from 'aws-sdk/clients/dynamodb';

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
    cancelAppointment(event)
    .then(() => callback(null, response))
    .catch(callback);
}

async function cancelAppointment(record) {
    if (!record || !record.body) {
        throw new Error('Invalid event');
    }
    const eventData = JSON.parse(record.body);
    if (!eventData) {
        throw new Error('Invalid event');
    }
    await cancelAppointment(eventData);
}

async function cancel(data) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const messageInfo: DeleteItemInput = {
        TableName: tableName,
        Key: { id: uuid() }
    };
    return new Promise((resolve, reject) => {
        dynamoDb.delete(messageInfo, (error, response) => {
            if (error) {
                return reject(error);
            }
            resolve(null);
        });
    });

}