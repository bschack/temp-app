const { DynamoDBClient, paginateScan, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { verifyPassword, hashPassword } = require('../auth/authUser');

const client = new DynamoDBClient(
  {
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

const docClient = DynamoDBDocumentClient.from(client);


const getTempPage = async (pageNumber = 0) => {
  /***
   * This function retrieves a page of data from the temp_data table.
   */

  const params = {
    TableName: "temp_data",
    Limit: 100
  };

  const paginator = paginateScan({ client }, params);

  let currentPage = 0;

  for await (const page of paginator) {
    if (currentPage === pageNumber) {
      return page.Items;
    }
    currentPage++;
  }

  throw new Error('Page not found');
};

const validateUser = async (username, password) => {
  const params = {
    TableName: 'users',
    Key: {
      'username': username,
    },
  };

  try {
    const data = await docClient.send(new GetCommand(params));
    if (data.Item && data.Item.password) {
      const match = await verifyPassword(password, data.Item.password);
      return match;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    return false;
  }
}

const registerUser = async (username, password) => {
  const getItemParams = {
    TableName: "users",
    Key: {
      "username": { S: username }
    }
  };

  try {
    const getItemData = await client.send(new GetItemCommand(getItemParams));
    if (getItemData.Item) {
      // Username already exists
      console.log('Username already exists');
      return { success: false, message: "Username already exists" };
    }
    if (password.length < 5) {
      return { success: false, message: "Password must be at least 5 characters" };
    }

    // Username does not exist, proceed with registration
    const hashedPassword = await hashPassword(password);

    const putItemParams = {
      TableName: "users",
      Item: {
        "username": { S: username },
        "password": { S: hashedPassword },
      }
    };

    const putItemData = await client.send(new PutItemCommand(putItemParams));
    console.log('User registered successfully:', JSON.stringify(putItemData));
    return { success: true, message: "User registered successfully" };

  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Error registering user" };
  }
};

module.exports = { getTempPage, validateUser, registerUser };
