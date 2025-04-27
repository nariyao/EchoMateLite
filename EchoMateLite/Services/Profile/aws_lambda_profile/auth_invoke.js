    // Import AWS SDK Lambda client
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

async function invokeAuthLambda(event) {
  const params = {
    FunctionName: process.env.AUTH_LAMBDA_FUNCTION_NAME,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(event)
  };

  try {
    const response = await lambda.invoke(params).promise();
    return JSON.parse(response.Payload);
  } catch (error) {
    console.error('Error invoking auth lambda:', error);
    throw error;
  }
}