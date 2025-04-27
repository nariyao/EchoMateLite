const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const BUCKET_NAME = env.process.BUCKET_NAME;
const TABLE_NAME = env.process.TABLE_NAME;

export default uploadImage = async (data) => {
    const { fileName, fileContent, metadata } = data;
    const imageId = new Date().getTime().toString();
    const newFileName = `${imageId}-${fileName}`;
    
    await S3.putObject({
        Bucket: BUCKET_NAME,
        Key: newFileName,
        Body: Buffer.from(fileContent, 'base64')
    }).promise();
    
    await DynamoDB.put({
        TableName: TABLE_NAME,
        Item: {
            imageId,
            fileName: newFileName,
            metadata
        }
    }).promise();
    
    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Image created', imageId })
    };
};