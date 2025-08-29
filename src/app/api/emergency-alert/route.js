import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    console.log('Emergency alert API called');
    
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization token provided');
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', !!token);
    
    let decoded;
    let userEmail;
    let userId;
    
    try {
      // Try to decode as our custom JWT first
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Custom JWT decoded successfully:', decoded);
      
      if (decoded.userId) {
        userId = decoded.userId;
        userEmail = decoded.email;
      } else if (decoded.email) {
        // If no userId but has email, this might be from NextAuth or older token
        userEmail = decoded.email;
        console.log('Token has email but no userId, will look up user by email');
      }
    } catch (error) {
      console.log('Custom JWT verification failed:', error.message);
      
      // Try to decode as NextAuth JWT
      try {
        decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        console.log('NextAuth JWT decoded successfully:', decoded);
        userEmail = decoded.email;
      } catch (nextAuthError) {
        console.log('NextAuth JWT verification also failed:', nextAuthError.message);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    const requestData = await request.json();
    console.log('Request data:', requestData);
    
    const { latitude, longitude, address, message, emergencyType } = requestData;

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Location coordinates are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bharatgpt');
    
    let user;
    
    if (userId) {
      console.log('Looking for user with ID:', userId);
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    } else if (userEmail) {
      console.log('Looking for user with email:', userEmail);
      user = await db.collection('users').findOne({ email: userEmail });
    } else {
      console.log('No userId or email found in token');
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use the found user's ID for further operations
    const actualUserId = user._id.toString();
    console.log('Actual user ID:', actualUserId);

    // Get emergency contacts
    console.log('Looking for emergency contacts for userId:', actualUserId);
    const contacts = await db.collection('emergency_contacts')
      .find({ userId: actualUserId })
      .toArray();
      
    console.log('Emergency contacts found:', contacts.length);

    if (contacts.length === 0) {
      console.log('No emergency contacts found');
      return NextResponse.json({ error: 'No emergency contacts found. Please add emergency contacts first.' }, { status: 400 });
    }

    // Create emergency message
    const currentTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Determine emergency type from message or use default
    const emergencyTypeTitle = emergencyType ? 
      emergencyType.charAt(0).toUpperCase() + emergencyType.slice(1).replace(/([A-Z])/g, ' $1') : 
      'Emergency';

    // Create a simpler, more WhatsApp-friendly message
    const locationText = address ? `${address}` : `GPS: ${latitude}, ${longitude}`;
    
    const emergencyMessage = `🚨 EMERGENCY ALERT 🚨

${user.name || 'Someone'} NEEDS HELP!

📍 LOCATION:
${locationText}

🗺️ MAPS: https://www.google.com/maps?q=${latitude},${longitude}

Emergency: ${emergencyTypeTitle}
Time: ${new Date().toLocaleString('en-IN', { 
  timeZone: 'Asia/Kolkata',
  dateStyle: 'short',
  timeStyle: 'short'
})}

🆘 ACTION:
1. Call them NOW
2. Go to location (use map link)
3. Call 112 if needed

Police: 100 | Medical: 108`;

    // No email functionality needed - only WhatsApp and SMS

    // Generate alert URLs for each contact (WhatsApp and SMS only)
    const alertMethods = contacts.map(contact => {
      const encodedMessage = encodeURIComponent(emergencyMessage);
      const encodedPhone = encodeURIComponent(contact.phone.replace(/\D/g, ''));
      
      return {
        contactId: contact._id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        whatsappUrl: `https://wa.me/${encodedPhone}?text=${encodedMessage}`,
        smsUrl: `sms:${contact.phone}?body=${encodedMessage}`
      };
    });

    // Log the emergency alert
    const alertLog = {
      userId: actualUserId,
      userName: user.name || 'Unknown',
      userEmail: user.email,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || null
      },
      message: emergencyMessage,
      contactsNotified: contacts.length,
      contactDetails: contacts.map(c => ({
        contactId: c._id,
        name: c.name,
        phone: c.phone,
        relationship: c.relationship
      })),
      timestamp: new Date(),
      status: 'sent'
    };

    await db.collection('emergency_alerts').insertOne(alertLog);

    return NextResponse.json({
      message: 'Emergency alert prepared successfully',
      alertMethods,
      contactsCount: contacts.length,
      location: {
        latitude,
        longitude,
        address,
        mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
      }
    });

  } catch (error) {
    console.error('Error sending emergency alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
