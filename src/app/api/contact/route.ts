import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, department } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Create support ticket
    // 4. Send confirmation email to customer

    // For now, we'll just log the contact request
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      department,
      timestamp: new Date().toISOString()
    });

    // You could also save this to a database table for contact submissions
    // await db.contactSubmission.create({
    //   data: {
    //     name,
    //     email,
    //     phone,
    //     subject,
    //     message,
    //     department,
    //     status: 'new'
    //   }
    // });

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        ticketId: `TKT-${Date.now()}` // Generate a ticket ID
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}