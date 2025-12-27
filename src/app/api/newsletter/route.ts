import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await db.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 409 }
        );
      } else {
        // Reactivate existing subscription
        await db.newsletter.update({
          where: { email },
          data: { isActive: true },
        });
        
        return NextResponse.json(
          { message: 'Subscription reactivated successfully' },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    await db.newsletter.create({
      data: {
        email,
      },
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}