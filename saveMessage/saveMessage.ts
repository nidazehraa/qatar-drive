import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

import { tableName, snsTopic } from './config';

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
    saveAndSendMessage(event)
    .then(() => callback(null, response))
    .catch(callback);
}

async function saveAndSendMessage(record) {
    if (!record || !record.body) {
        throw new Error('Invalid event');
    }
    const eventData = getEventData(record.body);
    if (!eventData) {
        throw new Error('Invalid event');
    }
    await saveMessage(eventData);
    await publishMessage(eventData);
}

function getEventData(event) {
    const message = JSON.parse(event);
    return _.get(message, 'event-data');
}

function saveMessage(message) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const messageInfo = {
        TableName: tableName,
        Item: { id: uuid(), message: JSON.stringify(message) }
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

function publishMessage(message) {
    const sns = new AWS.SNS();
    console.log('Event Received');
    const params = {
        Message: JSON.stringify(message),
        Subject: "email status",
        TopicArn: snsTopic
    };
    return new Promise((resolve, reject) => {
        sns.publish(params, (error, response) => {
            if (error) {
                return reject(error);
            }
            resolve(null);
        });
    });
}
