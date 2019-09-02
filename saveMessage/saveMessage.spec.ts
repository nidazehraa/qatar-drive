import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { handler } from './saveMessage';
import { assert, sandbox } from '../testHelpers';

describe('saveMessage', () => {

    const event = { "event-data": { "id": "test" } };

    let logSpy;
    let message;

    beforeEach(() => {
        sandbox.stub()
        message = { body: JSON.stringify(event) };
        logSpy = sandbox.spy(console, 'log');
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, "successfully put item in database");
        });
        AWSMock.mock('SNS', 'publish', 'test-message');
    });

    afterEach(() => {
        AWSMock.restore('SNS', 'publish');
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('should save the message in db and fire an event', (done) => {
        handler(message, null, (error, message) => {
            assert.calledWith(logSpy, 'Event Received');
            done();
        });
    });

    it('should return an error if the event has no body', (done) => {
        handler({}, null, (error, message) => {
            assert.deepEqual(error.message, 'Invalid event');
            done();
        });
    });

    it('should return an error if the event has no event data', (done) => {
        handler({ body: JSON.stringify({}) }, null, (error, message) => {
            assert.deepEqual(error.message, 'Invalid event');
            done();
        });
    });

    it('should return an error if saving to database errors', (done) => {
        AWSMock.remock('DynamoDB.DocumentClient', 'put', function(params, callback) {
            callback(new Error('error'), null);
        });
        handler(message, null, (error, response) => {
            assert.deepEqual(error.message, 'error');
            done();
        });
    });

    it('should return an error if publishing to sns topic errors', (done) => {
        AWSMock.remock('SNS', 'publish', function(params, callback) {
            callback(new Error('error'), null);
        });
        handler(message, null, (error, response) => {
            assert.deepEqual(error.message, 'error');
            done();
        });
    });
});
