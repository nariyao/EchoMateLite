const AWS = require('aws-sdk');
const corsHeaders = require('./corsHeaders');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: process.env.MY_AWS_REGION });
const cognito = new AWS.CognitoIdentityServiceProvider();

// Fix: Changed from ES6 export to CommonJS exports
const Register = async (event) => {
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const register = JSON.parse(event.body).userRegister;
    const userDetails = JSON.parse(event.body).userDetails;

    const userId = uuidv4(); // Fix: Removed the tilde (~) which was causing a syntax error

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
        if (userRes.statusCode !== 200) { // Fix: Corrected the condition check
            throw new Error(userRes.message);
        }
        
        // Fix: Added declaration for resData
        const resData = {
            UserConfirmed: response.UserConfirmed,
            UserSub: response.UserSub,
            UserEmail: register.email, // Fix: Changed how we get the email
            userDB: userRes.body
        };
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(resData)
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: error.message })
        };
    }
};

// Export the function
module.exports = Register;