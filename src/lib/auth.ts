import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export interface JwtPayload {
  userId: string;
  role: string;
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function withAuth(req: NextRequest, roles?: string[]) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return { user: null, error: 'Unauthorized', status: 401 };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { user: null, error: 'Invalid token', status: 401 };
  }

  if (roles && !roles.includes(decoded.role)) {
    return { user: null, error: 'Forbidden', status: 403 };
  }

  return { user: decoded, error: null, status: 200 };
}
