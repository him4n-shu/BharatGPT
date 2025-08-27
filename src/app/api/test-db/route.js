import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Get document count for each collection
    const stats = {};
    for (const name of collectionNames) {
      stats[name] = await db.collection(name).countDocuments();
    }
    
    return NextResponse.json({
      status: 'Connected successfully to MongoDB Atlas',
      database: 'bharatgpt',
      collections: stats
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      error: 'Failed to connect to database',
      details: error.message
    }, { status: 500 });
  }
} 