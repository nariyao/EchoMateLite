const AWS = require('aws-sdk');
const DB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = process.env.DYNAMO_DB_TABLE_NAME;
const uuid = require('uuid');


// Function to upload user details to DynamoDB
const uploadUserDetails = async (user) => {
    user.doj = new Date().toISOString();
    user.userId = uuid.v4();

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: { ...user }
        };

        const response = await DB.put(params).promise();
        return {
            statusCode: 200,
            message: 'User details uploaded successfully',
            body: JSON.stringify(response)
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Error uploading user details',
            error: error
        };
    }
}

export default uploadUserDetails;