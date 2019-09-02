# receeve-handler

## How to run the App

To setup the whole environment, follow the steps.
* Install all the dependencies by running `npm install`
* Compile the code by running `npm run tsc`.
* Finally run `npm run deploy` to deploy the serverless application.
* If you want to run test cases, run `npm run test`

## Expected behavior:

  * This will print the API Gateway endpoint which you can use in your Mailgun to add the Webhook, Example:

  ```
    Serverless: Packaging service...
    Serverless: Excluding development dependencies...
    Serverless: Uploading CloudFormation file to S3...
    Serverless: Uploading artifacts...
    Serverless: Uploading service .zip file to S3 (8.24 MB)...
    Serverless: Validating template...
    Serverless: Updating Stack...
    Serverless: Checking Stack update progress...
    ..............
    Serverless: Stack update finished...
    Service Information
    service: receeve-handler
    stage: dev
    region: eu-central-1
    stack: receeve-handler-dev
    api keys:
    None
    endpoints:
    POST - https://xxxxx.execute-api.eu-central-1.amazonaws.com/dev/mail/event
    functions:
    save-message: receeve-handler-dev-save-message
    layers:
    None
    Serverless: Removing old service artifacts from S3...

```
  * If you send an event, it should publish an message content to SNS topic and save the message in dynamodb.
