import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { sanitizeInput, validatePhoneNumber } from '@/lib/utils';

export async function GET(request) {
  try {
    // Check for Google OAuth custom headers first
    const userEmail = request.headers.get('X-User-Email');
    const authProvider = request.headers.get('X-Auth-Provider');
    
    let userId = null;
    let decoded = null;
    let finalUserEmail = null;
    
    if (userEmail && authProvider === 'google') {
      // Handle Google OAuth users
      finalUserEmail = userEmail;
    } else {
      // Handle traditional JWT token authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        // Try to decode as our custom JWT first
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
          userId = decoded.userId;
          finalUserEmail = decoded.email;
        }
      } catch (error) {
        // Try to decode as NextAuth JWT
        try {
          decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
          finalUserEmail = decoded.email;
        } catch (nextAuthError) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
      }
      
      if (!decoded || !finalUserEmail) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    if (!finalUserEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get user to find their ID using email
    let actualUserId = userId;
    if (!actualUserId && finalUserEmail) {
      const user = await db.collection('users').findOne({ email: finalUserEmail.toLowerCase().trim() });
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
    // Check for Google OAuth custom headers first
    const userEmail = request.headers.get('X-User-Email');
    const authProvider = request.headers.get('X-Auth-Provider');
    
    let userId = null;
    let decoded = null;
    let finalUserEmail = null;
    
    if (userEmail && authProvider === 'google') {
      // Handle Google OAuth users
      console.log('Google OAuth user detected:', userEmail);
      finalUserEmail = userEmail;
    } else {
      // Handle traditional JWT token authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        // Try to decode as our custom JWT first
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
          userId = decoded.userId;
          finalUserEmail = decoded.email;
        }
      } catch (error) {
        // Try to decode as NextAuth JWT
        try {
          decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
          finalUserEmail = decoded.email;
        } catch (nextAuthError) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
      }
      
      if (!decoded || !finalUserEmail) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }
    
    if (!finalUserEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 401 });
    }

    const { name, phone, relationship } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedRelationship = relationship ? sanitizeInput(relationship) : '';

    // Validate inputs
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      return NextResponse.json({ error: 'Name must be between 2 and 50 characters' }, { status: 400 });
    }

    if (!validatePhoneNumber(sanitizedPhone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    if (sanitizedRelationship && sanitizedRelationship.length > 20) {
      return NextResponse.json({ error: 'Relationship must be 20 characters or less' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get user to find their ID using email
    let actualUserId = userId;
    if (!actualUserId && finalUserEmail) {
      const user = await db.collection('users').findOne({ email: finalUserEmail.toLowerCase().trim() });
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
      name: sanitizedName,
      phone: sanitizedPhone,
      relationship: sanitizedRelationship || 'Emergency Contact',
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
    // Check for Google OAuth custom headers first
    const userEmail = request.headers.get('X-User-Email');
    const authProvider = request.headers.get('X-Auth-Provider');
    
    let userId = null;
    let decoded = null;
    let finalUserEmail = null;
    
    if (userEmail && authProvider === 'google') {
      // Handle Google OAuth users
      finalUserEmail = userEmail;
    } else {
      // Handle traditional JWT token authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        // Try to decode as our custom JWT first
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
          userId = decoded.userId;
          finalUserEmail = decoded.email;
        }
      } catch (error) {
        // Try to decode as NextAuth JWT
        try {
          decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
          finalUserEmail = decoded.email;
        } catch (nextAuthError) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
      }
      
      if (!decoded || !finalUserEmail) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    if (!finalUserEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');

    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    // Get user to find their ID using email
    let actualUserId = userId;
    if (!actualUserId && finalUserEmail) {
      const user = await db.collection('users').findOne({ email: finalUserEmail.toLowerCase().trim() });
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
