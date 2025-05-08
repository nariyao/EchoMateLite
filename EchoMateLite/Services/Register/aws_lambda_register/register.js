const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.MY_AWS_REGION });
const cognito = new AWS.CognitoIdentityServiceProvider();

export default Register = async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const email = JSON.parse(event.body).email;
    const password = JSON.parse(event.body).password;

    const register = JSON.parse(event.body).userRegister;
    const userDetails = JSON.parse(event.body).userDetails;



    const params = {
        ClientId: clientId,
        UserPoolId: userPoolId,
        Username: email,
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
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(resData)
            };
        }
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(resData)
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(error.message)
        };
    }
};
