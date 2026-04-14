import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    
    let suppliers;
    
    if (region) {
      suppliers = await db.supplier.findMany({
        where: {
          isActive: true,
          region: {
            contains: region,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      suppliers = await db.supplier.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, region, country } = await request.json();

    if (!name || !email || !region || !country) {
      return NextResponse.json(
        { error: 'Name, email, region, and country are required' },
        { status: 400 }
      );
    }

    // Check if supplier already exists
    const existingSupplier = await db.supplier.findUnique({
      where: { email },
    });

    if (existingSupplier) {
      return NextResponse.json(
        { error: 'A supplier with this email already exists' },
        { status: 409 }
      );
    }

    const supplier = await db.supplier.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        region,
        country,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier request' },
      { status: 500 }
    );
  }
}