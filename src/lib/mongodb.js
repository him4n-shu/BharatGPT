import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
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
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

export default clientPromise;
