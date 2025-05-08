const AWS = require('aws-sdk');
const corsHeaders = require('./corsHeaders');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: process.env.MY_AWS_REGION });
const cognito = new AWS.CognitoIdentityServiceProvider();

export default Register = async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const register = JSON.parse(event.body).userRegister;
    const userDetails = JSON.parse(event.body).userDetails;

    const userId = ~uuidv4();
    userDetails.userId = userId;


    const params = {
        ClientId: clientId,
        UserPoolId: userPoolId,
        Username: userId,
        Password: register.password,
        UserAttributes: [
            {
                Name: 'email',
                Value: register.email
            }
        ]
    };

    try {
        const response = await cognito.signUp(params).promise();
        const userRes = await uploadUserDetails(userDetails);
        if (!userRes.statusCode !== 200) {
            throw new Error(userRes.message);
        }
        resData = {
            UserConfirmed: response.UserConfirmed,
            UserSub: response.UserSub,
            UserEmail: response.UserAttributes.find(attr => attr.Name === 'email').Value,
            userDB: userRes.body
        };
        if (response.UserConfirmed) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(resData)
            };
        }
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(resData)
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify(error.message)
        };
    }
};
