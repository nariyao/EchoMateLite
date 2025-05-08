const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    switch (event.httpMethod + event.resource) {
        case 'POST/register':
            return Register(event);
        case 'POST/emailConfirmation':
            return emailConfirmation(event);
        default:
            console.log('Invalid request:', event.httpMethod, event.resource);
            console.log('Event:', event);
            let bodyData = {
                message: 'Invalid request',
                method: event.httpMethod,
                resource: event.resource
            };
    }
    return {
        statusCode: 404,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(bodyData)
    };
}
