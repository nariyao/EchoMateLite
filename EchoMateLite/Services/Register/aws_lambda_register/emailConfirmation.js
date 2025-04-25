const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

export default emailConfirmation= async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.USER_POOL_CLIENT_ID;
    const email = event.queryStringParameters.email;
    const confirmationCode = JSON.parse(event.body).confirmationCode;
    
    const params = {
        ClientId: clientId,
        email: email,
        ConfirmationCode: confirmationCode
    };
    
    try {
        const response = await cognito.confirmSignUp(params).promise();
        if (response.UserConfirmed) {
            console.log(`User ${email} confirmed successfully.`);
        } else {
            throw new Error(`User ${email} could not be confirmed.`);
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        };
    }
};
