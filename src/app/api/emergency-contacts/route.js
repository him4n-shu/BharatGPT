import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    let userEmail;
    let userId;
    
    try {
      // Try to decode as our custom JWT first
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.userId) {
        userId = decoded.userId;
        userEmail = decoded.email;
      } else if (decoded.email) {
        userEmail = decoded.email;
      }
    } catch (error) {
      // Try to decode as NextAuth JWT
      try {
        decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        userEmail = decoded.email;
      } catch (nextAuthError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get user to find their ID if we only have email
    let actualUserId = userId;
    if (!actualUserId && userEmail) {
      const user = await db.collection('users').findOne({ email: userEmail });
      if (user) {
        actualUserId = user._id.toString();
      }
    }
    
    if (!actualUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const contacts = await db.collection('emergency_contacts')
      .find({ userId: actualUserId })
      .toArray();

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    let userEmail;
    let userId;
    
    try {
      // Try to decode as our custom JWT first
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.userId) {
        userId = decoded.userId;
        userEmail = decoded.email;
      } else if (decoded.email) {
        userEmail = decoded.email;
      }
    } catch (error) {
      // Try to decode as NextAuth JWT
      try {
        decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        userEmail = decoded.email;
      } catch (nextAuthError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    const { name, phone, relationship } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get user to find their ID if we only have email
    let actualUserId = userId;
    if (!actualUserId && userEmail) {
      const user = await db.collection('users').findOne({ email: userEmail });
      if (user) {
        actualUserId = user._id.toString();
      }
    }
    
    if (!actualUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has 5 contacts (limit)
    const contactCount = await db.collection('emergency_contacts')
      .countDocuments({ userId: actualUserId });
    
    if (contactCount >= 5) {
      return NextResponse.json({ error: 'Maximum 5 emergency contacts allowed' }, { status: 400 });
    }

    const contact = {
      userId: actualUserId,
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship ? relationship.trim() : 'Emergency Contact',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('emergency_contacts').insertOne(contact);
    
    return NextResponse.json({ 
      message: 'Emergency contact added successfully',
      contactId: result.insertedId
    });
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    let userEmail;
    let userId;
    
    try {
      // Try to decode as our custom JWT first
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.userId) {
        userId = decoded.userId;
        userEmail = decoded.email;
      } else if (decoded.email) {
        userEmail = decoded.email;
      }
    } catch (error) {
      // Try to decode as NextAuth JWT
      try {
        decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        userEmail = decoded.email;
      } catch (nextAuthError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');

    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get user to find their ID if we only have email
    let actualUserId = userId;
    if (!actualUserId && userEmail) {
      const user = await db.collection('users').findOne({ email: userEmail });
      if (user) {
        actualUserId = user._id.toString();
      }
    }
    
    if (!actualUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const result = await db.collection('emergency_contacts').deleteOne({
      _id: new ObjectId(contactId),
      userId: actualUserId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
