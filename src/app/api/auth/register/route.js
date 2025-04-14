import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// MongoDB Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatgpt';

export async function POST(request) {
  try {
    const { name, email, password, mobileNumber } = await request.json();

    // Validate input
    if (!name || !email || !password || !mobileNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('bharatgpt');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      await client.close();
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      createdAt: new Date(),
    };

    // Insert user into database
    await usersCollection.insertOne(newUser);
    await client.close();

    // Return success response (exclude password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}