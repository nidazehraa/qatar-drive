import * as AWS from 'aws-sdk';
import { handler } from './saveMessage';
import { assert, sandbox } from '../testHelpers';

describe('saveMessage', () => {

    let logSpy;
    let eventStub;
    let dynamodbPutStub;
    let message;

    beforeEach(() => {
        const event = { "event-data": { "id": "test" } };
        const sns = new AWS.SNS();
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        message = {
            body: JSON.stringify(event)
        };
        logSpy = sandbox.spy(console, 'log');
        eventStub = sandbox.stub(sns, 'publish').callsFake((): any => Promise.resolve(null))
        dynamodbPutStub = sandbox.stub(dynamoDb, 'put').callsFake((): any => Promise.resolve(null))
    });

    it('should save the message in db and fire an event', (done) => {
        handler(message, null, (error, message) => {
            assert.called(dynamodbPutStub);
            assert.called(logSpy);
            assert.called(eventStub);
            done();
        });
    });
});
