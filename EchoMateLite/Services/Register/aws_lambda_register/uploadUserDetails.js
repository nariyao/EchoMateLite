const AWS = require('aws-sdk');
const DB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = process.env.DYNAMO_DB_TABLE_NAME;
const corsHeaders = require('./corsHeaders');

// Function to upload user details to DynamoDB
const uploadUserDetails = async (user) => {
    user.doj = new Date().toISOString();

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: { ...user }
        };

        const response = await DB.put(params).promise();
        return {
            statusCode: 200,
            headers: corsHeaders,
            message: 'User details uploaded successfully',
            body: JSON.stringify(response)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            message: 'Error uploading user details',
            error: error
        };
    }
}

export default uploadUserDetails;