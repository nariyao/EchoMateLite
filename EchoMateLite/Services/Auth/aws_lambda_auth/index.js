
// AWS Cognito authorization check
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// Configure the Amazon Cognito credentials provider
AWS.config.region = process.env.AWS_REGION; // e.g., 'us-east-1'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID
});

// Configure Cognito user pool
const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID, // e.g., 'us-east-1_XXXXXXXXX'
    ClientId: process.env.COGNITO_APP_CLIENT_ID // e.g., '
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to check if user is authenticated
const checkAuth = () => {
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
            reject(new Error('No user found'));
            return;
        }

        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (!session.isValid()) {
                reject(new Error('Invalid session'));
                return;
            }

            // Get user attributes
            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                resolve({
                    user: cognitoUser,
                    session: session,
                    attributes: attributes
                });
            });
        });
    });
};

// Function to check specific authorization claims
const checkUserPermissions = async () => {
    try {
        const authDetails = await checkAuth();
        const session = authDetails.session;
        
        // Get JWT token claims
        const payload = session.getIdToken().decodePayload();
        
        // Check user groups/roles
        const groups = payload['cognito:groups'] || [];
        const isAdmin = groups.includes('admin');
        
        return {
            isAuthenticated: true,
            isAdmin: isAdmin,
            groups: groups,
            username: payload['cognito:username']
        };
        
    } catch (error) {
        return {
            isAuthenticated: false,
            isAdmin: false,
            groups: [],
            username: null
        };
    }
};

const handler = async (event) => {
    const authDetails = await checkUserPermissions();
    return {
        statusCode: 200,
        body: JSON.stringify(authDetails)
    };
};