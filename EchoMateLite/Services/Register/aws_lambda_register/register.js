const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

export default Register = async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const username = event.username;
    const password = event.password;
    const email = event.email;
    
    const params = {
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            }
        ]
    };
    
    try {
        const response = await cognito.signUp(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify('User registered successfully!')
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        };
    }
};
