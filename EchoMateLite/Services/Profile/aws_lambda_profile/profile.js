const DynamoDB = require('./dynamodb')
const auth_invoke = require('./auth')

const userTable = process.env.DYNAMODB_USER_DETAILS

function getProfile(event){
    const email = event.queryStringParameters.email;
    const auth = auth_invoke.invokeAuthLambda(event);
    if(auth.statusCode != 200){
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Unauthorized'})
        }
    }else if(auth.statusCode == 200 && auth.body.email === email){
        return {
            statusCode: 200,
            body: DynamoDB.readItem(userTable, {email: email});
        }
    }else{
        let result = DynamoDB.readItem(userTable, {email: email});
        return {
            statusCode: 200,
            body: result
        }
    }
}
async function updateProfile(event){
    const email  = event.queryStringParameters.email;
    const KEY = Object.keys(event.body)[0];
    const VALUE = Object.values(event.body)[0];
    const updateExpression = `set #${KEY} = :${KEY}`;
    const expressionValues = {[`:${KEY}`]: VALUE};
    let result = await DynamoDB.updateItem(userTable, {email: email}, updateExpression,expressionValues);
    return result;
}

function createProfile(event){
    let item = event.body;
    return DynamoDB.createItem(procss.env.DYNAMODB_USER_DETAILS, item);
}

function deleteProfile(event){
    const emial = event.queryStringParameters.email;
    return DynamoDB.deleteItem(userTable, {email: email});    
}

exports.module = {
    getProfile,
    updateProfile,
    createProfile,
    deleteProfile
}
