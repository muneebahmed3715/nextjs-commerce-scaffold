import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBearerToken, verifyAuthToken } from '@/lib/auth';

export type AdminAuthSuccess = {
  ok: true;
  userId: string;
};

export type AdminAuthFailure = {
  ok: false;
  response: NextResponse;
};

export async function requireAdmin(
  request: NextRequest
): Promise<AdminAuthSuccess | AdminAuthFailure> {
  const token = getBearerToken(request);

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = verifyAuthToken(token);

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
      };
    }

    return {
      ok: true,
      userId: user.id,
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
    };
  }
}
