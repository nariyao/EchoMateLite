const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const corsHeaders = require('./corsHeaders');

exports.handler = async (event) => {
    // Handle OPTIONS requests (preflight requests)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

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
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify(bodyData)
            };
    }
}

