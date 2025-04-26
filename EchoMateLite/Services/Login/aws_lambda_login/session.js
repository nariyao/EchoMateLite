
// AWS SDK and Redis client setup
const AWS = require('aws-sdk');
const Redis = require('ioredis');

// Initialize Redis client
const redis = new Redis({
  host: process.env.ELASTICACHE_ENDPOINT,
  port: 6379
});

// Function to save Cognito token to ElastiCache
const saveCognitoToken = async (email, token) => {
  try {
    // Set token with 1 hour expiry
    await redis.setex(`cognito:token:${email}`, 3600, token);
    return true;
  } catch (error) {
    console.error('Error saving token to ElastiCache:', error);
    return false;
  }
};

// Function to retrieve token from ElastiCache
const getCognitoToken = async (email) => {
  try {
    const token = await redis.get(`cognito:token:${email}`);
    return token;
  } catch (error) {
    console.error('Error retrieving token from ElastiCache:', error);
    return null;
  }
};

module.exports = {
  getCognitoToken,
  saveCognitoToken
};