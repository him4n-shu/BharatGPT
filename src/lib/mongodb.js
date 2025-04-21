import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
console.log('MongoDB URI prefix:', uri.split('@')[0].split(':')[0]); // Logs only the protocol part for safety

const options = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '5'),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '1'),
  maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME_MS || '60000'),
  connectTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  family: 4,
  retryWrites: true,
  w: 'majority'
};

let clientPromise;

if (!clientPromise) {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then(client => {
      console.log('MongoDB connected successfully');
      return client;
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB. Error details:');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      if (err.cause) {
        console.error('Cause:', err.cause.message);
      }
      
      // Check if it's a connection string issue
      if (err.message.includes('Invalid connection string')) {
        console.error('Invalid MongoDB connection string. Please check your MONGODB_URI environment variable.');
      }
      
      // Check if it's an authentication issue
      if (err.message.includes('Authentication failed')) {
        console.error('MongoDB authentication failed. Please check your username and password.');
      }
      
      throw err;
    });
}

export default clientPromise;
