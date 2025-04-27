const PROFILE = required("./profile")

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

exports.handler = async (event)=>{

    switch(event.httpMethod+event.resource){
        case 'GET/api/profile':
            return PROFILE.getProfile(event);
        case 'PUT/api/profile/edit':
            return PROFILE.updateProfile(event);
        case 'POST/api/profile/create':
            return PROFILE.createProfile(event);
        case 'DELETE/api/profile/delete':
            return PROFILE.deleteProfile(event);
        default:
            return {
                statusCode: 404,
                body: JSON.stringify({message: 'Not Found'})
            }
    }
}