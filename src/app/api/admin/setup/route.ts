import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/admin-auth';

async function hasAnyAdmin() {
  const count = await db.user.count({ where: { role: 'ADMIN' } });
  return count > 0;
}

export async function GET() {
  try {
    const hasAdmin = await hasAnyAdmin();
    return NextResponse.json({ hasAdmin });
  } catch (error) {
    console.error('Admin setup check error:', error);
    return NextResponse.json(
      { error: 'Failed to check admin setup state' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!normalizedName || !normalizedEmail || !rawPassword) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (rawPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const hasAdmin = await hasAnyAdmin();

    if (hasAdmin) {
      const adminCheck = await requireAdmin(request);
      if (!adminCheck.ok) {
        return NextResponse.json(
          { error: 'Admin account already exists. Only admins can create another admin.' },
          { status: 403 }
        );
      }
    }

    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const adminUser = await db.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Admin account created successfully',
        admin: adminUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
