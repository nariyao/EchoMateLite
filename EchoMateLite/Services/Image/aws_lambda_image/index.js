const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const { httpMethod, body, pathParameters } = event;
    const imageId = pathParameters ? pathParameters.imageId : null;

    switch (httpMethod) {
        case 'POST':
            return await createImage(JSON.parse(body));
        case 'GET':
            return await readImage(imageId);
        case 'PUT':
            return await updateImage(imageId, JSON.parse(body));
        case 'DELETE':
            return await deleteImage(imageId);
        default:
            return {
                statusCode: 405,
                body: 'Method Not Allowed'
            };
    }
};
