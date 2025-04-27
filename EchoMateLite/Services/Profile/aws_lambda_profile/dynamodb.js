
// Import required AWS SDK modules
const AWS = require('aws-sdk');

// Configure AWS credentials and region
AWS.config.update({
  region: 'us-west-2' // Change to your region
});

// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

// Create item
const createItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item
  };

  try {
    await docClient.put(params).promise();
    return { success: true };
  } catch (err) {
    console.error('Error creating item:', err);
    return { success: false, error: err };
  }
};

// Read item
const readItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key
  };

  try {
    const data = await docClient.get(params).promise();
    return data.Item;
  } catch (err) {
    console.error('Error reading item:', err);
    return { success: false, error: err };
  }
};

// Update item
const updateItem = async (tableName, key, updateExpression, expressionValues) => {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionValues,
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const data = await docClient.update(params).promise();
    return { success: true, data: data.Attributes };
  } catch (err) {
    console.error('Error updating item:', err);
    return { success: false, error: err };
  }
};

// Delete item
const deleteItem = async (tableName, key) => {

  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: "set #isDeleted = :isDeleted",
    ExpressionAttributeValues: {":isDeleted": true},
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await docClient.update(params).promise();
    return { success: true };
  } catch (err) {
    console.error('Error deleting item:', err);
    return { success: false, error: err };
  }
};
