import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const DEFAULT_INSECURE_SECRET = 'your-secret-key';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret === DEFAULT_INSECURE_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set to a secure value in production.');
    }
    return DEFAULT_INSECURE_SECRET;
  }

  return secret;
}

export type JwtPayload = {
  userId: string;
  email?: string;
  role?: string;
};

export function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}