const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const BUCKET_NAME = env.process.BUCKET_NAME;
const TABLE_NAME = env.process.TABLE_NAME;

export default getImage = async (imageId) => {
    const result = await DynamoDB.get({
        TableName: TABLE_NAME,
        Key: { imageId }
    }).promise();
    
    if (!result.Item) {
        return {
            statusCode: 404,
            body: 'Image not found'
        };
    }
    
    const { fileName } = result.Item;
    const file = await S3.getObject({
        Bucket: BUCKET_NAME,
        Key: fileName
    }).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({ ...result.Item, fileContent: file.Body.toString('base64') })
    };
};
