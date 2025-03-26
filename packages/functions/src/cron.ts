
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

export const handler = async () => {
  const client = new DynamoDBClient();
  const command = new ScanCommand({
    TableName: "BrokerTable",
  });
  const result = await client.send(command);
  console.log(result);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from scheduled function' })
  };
}; 