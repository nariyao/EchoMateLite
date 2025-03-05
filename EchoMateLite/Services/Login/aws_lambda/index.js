const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const username = event.username;
    const password = event.password;
    
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password
        }
    };
    
    try {
        const response = await cognito.initiateAuth(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                id_token: response.AuthenticationResult.IdToken,
                access_token: response.AuthenticationResult.AccessToken,
                refresh_token: response.AuthenticationResult.RefreshToken
            })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        };
    }
};
