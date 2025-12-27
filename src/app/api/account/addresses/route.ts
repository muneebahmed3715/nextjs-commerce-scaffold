import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token and get user ID
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // For demo purposes, return mock addresses
    // In a real application, you would fetch from database
    const mockAddresses = [
      {
        id: '1',
        name: 'Home',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        isDefault: true,
      },
      {
        id: '2',
        name: 'Office',
        street: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        zip: '10002',
        country: 'United States',
        isDefault: false,
      },
    ];

    return NextResponse.json(mockAddresses);

    // Real implementation would be:
    /*
    const addresses = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        addresses: true,
      },
    });

    return NextResponse.json(addresses.addresses);
    */

  } catch (error) {
    console.error('Get addresses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}