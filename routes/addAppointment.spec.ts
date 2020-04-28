import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { handler } from './addAppointment';
import { assert, sandbox } from '../testHelpers';

describe('saveMessage', () => {

    const event = { "name": "test" };

    let message;

    beforeEach(() => {
        sandbox.stub()
        message = { body: JSON.stringify(event) };
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, "successfully put item in database");
        });
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient');
    });

    it('should save data in db and fire an event', (done) => {
        handler(message, null, (error, response) => {
            assert.deepEqual(response.statusCode, 200);
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
});
