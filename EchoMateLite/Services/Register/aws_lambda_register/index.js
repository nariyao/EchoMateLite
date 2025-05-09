const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const corsHeaders = require('./corsHeaders');
const Register = require('./register');

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event));
    
    // Handle OPTIONS requests (preflight requests)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // Extract the actual resource path from the event
    // API Gateway often includes the stage in the resource path
    const resourcePath = event.path || event.resource;
    console.log('Resource path:', resourcePath);
    
    // Check if the path ends with the specific endpoint
    const isRegisterEndpoint = resourcePath.endsWith('/api/auth/register');
    const isEmailConfirmationEndpoint = resourcePath.endsWith('/api/auth/emailConfirmation');
    
    if (event.httpMethod === 'POST' && isRegisterEndpoint) {
        return Register(event);
    } else if (event.httpMethod === 'POST' && isEmailConfirmationEndpoint) {
        return emailConfirmation(event);
    } else {
        console.log('Invalid request:', event.httpMethod, resourcePath);
        console.log('Event:', JSON.stringify(event));
        let bodyData = {
            message: 'Invalid request',
            method: event.httpMethod,
            resource: resourcePath
        };
        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify(bodyData)
        };
    }
};

// Email confirmation function implementation
async function emailConfirmation(event) {
    try {
        const body = JSON.parse(event.body);
        // Your email confirmation logic here
        
        // Return response with CORS headers
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Email confirmation successful'
                // Add other response data as needed
            })
        };
    } catch (error) {
        console.error('Error in emailConfirmation function:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Error processing email confirmation',
                error: error.message
            })
        };
    }
}