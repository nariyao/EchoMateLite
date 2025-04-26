const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const { saveCognitoToken } = require('./session');

exports.handler = async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const email = JSON.parse(event.body).email;
    const password = JSON.parse(event.body).password;
    
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            email: email,
            PASSWORD: password
        }
    };
    
    try {
        const response = await cognito.initiateAuth(params).promise();
        saveCognitoToken(email, response.AuthenticationResult )
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        };
    }
};
