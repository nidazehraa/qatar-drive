import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

AWS.config.update({
    region: 'eu-central-1'
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
        return Promise.reject(new Error('Invalid event'));
    }
    const eventData = getEventData(record.body);
    if (!eventData) {
        return Promise.reject(new Error('Invalid event'));
    }
    await saveMessage(eventData);
    console.log('djdjdjjdjdjdjdjdjdjdjdjdjdjdjj');
    await publishMessage(eventData);
}

function getEventData(event) {
    const message = JSON.parse(event);
    return _.get(message, 'event-data');
}

function saveMessage(message) {
    const messageInfo = {
        TableName: process.env.EMAILS_STATUS_TABLE,
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
    console.log('Publishing Event');
    const sns = new AWS.SNS();
    const params = {
        Message: JSON.stringify(message),
        Subject: "email status",
        TopicArn: process.env.SNS_TOPIC
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
