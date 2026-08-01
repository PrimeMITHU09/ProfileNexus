import crypto from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

export interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  telegramUsername?: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Base64Url helpers
function base64UrlEncode(str: string | Buffer): string {
  const buf = typeof str === 'string' ? Buffer.from(str) : str;
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Signs a JWT token using process.env.JWT_SECRET (HS256)
 */
export function signJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, jwtSecret: string, expiresInSeconds: number = 7 * 24 * 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(signatureInput)
    .digest();

  const encodedSignature = base64UrlEncode(signature);
  return `${signatureInput}.${encodedSignature}`;
}

/**
 * Verifies a JWT token using process.env.JWT_SECRET (HS256)
 */
export function verifyJwtToken(token: string, jwtSecret: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = base64UrlEncode(
      crypto.createHmac('sha256', jwtSecret).update(signatureInput).digest()
    );

    if (encodedSignature !== expectedSignature) {
      return null; // Invalid signature
    }

    const payload: JwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Express middleware to authenticate user via Authorization header Bearer token
 */
export function createAuthMiddleware(jwtSecret: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token header' });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyJwtToken(token, jwtSecret);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    req.user = user;
    next();
  };
}

/**
 * Express middleware to restrict access to ADMIN role only
 */
export function adminOnlyMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const adminHandle = (process.env.ADMIN_TELEGRAM_USERNAME || 'prime8088').toLowerCase();
  const isAdmin = req.user && req.user.role === 'ADMIN' && (
    (req.user.telegramUsername && req.user.telegramUsername.toLowerCase() === adminHandle) ||
    (req.user.name && req.user.name.toLowerCase() === adminHandle)
  );

  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin Control Panel is strictly restricted to Super Admin (@Prime8088)' });
  }
  next();
}
