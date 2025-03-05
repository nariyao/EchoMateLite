const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

export default emailConfirmation= async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.CLIENT_ID;
    const username = event.username;
    const confirmationCode = event.confirmationCode;
    
    const params = {
        ClientId: clientId,
        Username: username,
        ConfirmationCode: confirmationCode
    };
    
    try {
        const response = await cognito.confirmSignUp(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify('Email confirmed successfully!')
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        };
    }
};
