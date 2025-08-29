import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendNewsletterConfirmationEmail } from '@/lib/email';

export async function POST(request) {
  let client;
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get MongoDB client
    client = await clientPromise;
    const db = client.db('bharatgpt');
    const subscribersCollection = db.collection('newsletter_subscribers');

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is already subscribed
    const existingSubscriber = await subscribersCollection.findOne({ 
      email: normalizedEmail 
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        await subscribersCollection.updateOne(
          { email: normalizedEmail },
          { 
            $set: { 
              isActive: true, 
              resubscribedAt: new Date(),
              updatedAt: new Date()
            } 
          }
        );
      }
    } else {
      // Create new subscriber
      const newSubscriber = {
        email: normalizedEmail,
        isActive: true,
        subscribedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'footer_form'
      };

      await subscribersCollection.insertOne(newSubscriber);
    }

    // Send confirmation email
    const emailResult = await sendNewsletterConfirmationEmail(normalizedEmail);

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error);
      // Don't fail the subscription if email fails, just log it
    }

    return NextResponse.json({
      message: 'Successfully subscribed! Check your email for confirmation.',
      email: normalizedEmail
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle specific error types
    if (error.message.includes('Invalid email')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
