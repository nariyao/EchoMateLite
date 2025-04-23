
// AWS ElastiCache session management code
const AWS = require('aws-sdk');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');

// Sample session data structure
const sessionData = {
    id: 'sessionId',
    name: 'sessionName', 
    date: '2023-10-01T00:00:00Z',
    user: 'userId',
    token: 'tokenValue'
}

// Store session data in ElastiCache
const storeSessionInCache = async () => {
  try {
    await redisClient.hmset(`session:${sessionData.id}`, {
      name: sessionData.name,
      date: sessionData.date,
      user: sessionData.user,
      token: sessionData.token
    });
    // Set expiry to match session cookie maxAge (24 hours)
    await redisClient.expire(`session:${sessionData.id}`, 24 * 60 * 60);
    return true;
  } catch (err) {
    console.error('Error storing session in cache:', err);
    return false;
  }
};

// Get session data from ElastiCache
const getSessionFromCache = async (sessionId) => {
  try {
    const data = await redisClient.hgetall(`session:${sessionId}`);
    return data || null;
  } catch (err) {
    console.error('Error retrieving session from cache:', err);
    return null;
  }
};

// Function to get session data
const getSessionData = (req, res, key) => {
  try {
    return req.session[key] || null;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
};


// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION // Update with your region
});

// Create Redis client using ElastiCache endpoint
const redisClient = new Redis({
  host: process.env.AWS_Redis_EndPoint, // Update with your endpoint
  port: 6379
});

// Session middleware configuration
const sessionConfig = {
  store: new RedisStore({ 
    client: redisClient,
    prefix: 'session:' 
  }),
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
};

// Error handling for Redis client
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Export session middleware
module.exports = session(sessionConfig);