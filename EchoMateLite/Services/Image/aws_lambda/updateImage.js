const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const BUCKET_NAME = env.process.BUCKET_NAME;
const TABLE_NAME = env.process.TABLE_NAME;

export default updateImage = async (imageId, data) => {
    const { fileName, fileContent, metadata } = data;
    const newFileName = `${imageId}-${fileName}`;
    
    await S3.putObject({
        Bucket: BUCKET_NAME,
        Key: newFileName,
        Body: Buffer.from(fileContent, 'base64')
    }).promise();
    
    await DynamoDB.update({
        TableName: TABLE_NAME,
        Key: { imageId },
        UpdateExpression: 'set fileName = :fileName, metadata = :metadata',
        ExpressionAttributeValues: {
            ':fileName': newFileName,
            ':metadata': metadata
        }
    }).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Image updated', imageId })
    };
};
