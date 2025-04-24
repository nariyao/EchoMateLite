const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
   switch(event.httpMethod + event.resource) {
       case 'POST/register':
           return Register(event);
       case 'POST/emailConfirmation':
           return emailConfirmation(event);
       default:
           return {
               statusCode: 404,
               body: JSON.stringify('Invalid request')
           };
   }
};
