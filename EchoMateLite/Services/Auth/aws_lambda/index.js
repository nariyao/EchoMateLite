const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const request = require('request-promise');

exports.handler = async (event) => {
    const token = event.token;
    const userPoolId = process.env.USER_POOL_ID;
    const region = process.env.AWS_REGION;
    
    const keysUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    
    try {
        const response = await request({ uri: keysUrl, json: true });
        const keys = response.keys;
        
        const getKey = (kid) => {
            return keys.find(key => key.kid === kid);
        };
        
        const decoded = jwt.decode(token, { complete: true });
        const kid = decoded.header.kid;
        const key = getKey(kid);
        
        if (!key) {
            throw new Error('Public key not found.');
        }
        
        const publicKey = `-----BEGIN PUBLIC KEY-----\n${key.x5c[0]}\n-----END PUBLIC KEY-----`;
        
        const verified = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            audience: 'YOUR_CLIENT_ID'
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify(verified)
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify(error.message)
        };
    }
};
