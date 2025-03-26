export const handler = async () => {
  console.log('Hello from functions package');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from scheduled function' })
  };
}; 