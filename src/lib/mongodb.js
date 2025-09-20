import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
// Only log connection info in development
if (process.env.NODE_ENV === 'development') {
  console.log('MongoDB URI prefix:', uri.split('@')[0].split(':')[0]); // Logs only the protocol part for safety
}

const options = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '5'),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '1'),
  maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME_MS || '60000'),
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  ssl: true,
  tls: true,
  retryWrites: true,
  w: 'majority'
};

let clientPromise;

if (!clientPromise) {
  try {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect()
      .then(client => {
        if (process.env.NODE_ENV === 'development') {
          console.log('MongoDB connected successfully');
        }
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

        // Check if it's an SSL/TLS issue
        if (err.message.includes('SSL') || err.message.includes('TLS')) {
          console.error('SSL/TLS Connection Error. Please check:');
          console.error('1. Node.js version is up to date');
          console.error('2. SSL/TLS settings in MongoDB Atlas');
        }
        
        throw err;
      });
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
}

export default clientPromise;
