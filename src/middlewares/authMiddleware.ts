import { loginVerify } from '../utils/sessions';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  roleType: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload | undefined;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.trim();
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.',
      sessionExpired: true,
    });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT secret key is not configured.');
    }
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    req.user = decoded;
    loginVerify(req, res, next);
  } catch (err: any) {
    console.error('Token verification failed:', err);
    res.status(400).json({
      success: false,
      message: 'Invalid Token',
      error: err.message,
      sessionExpired: true,
    });
  }
};

// Middleware to authorize requests based on roles
export const authorize = (roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    console.log('user---', req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. No token provided.',
        sessionExpired: true,
      });
      return; // Ensure the function exits after sending the response
    }
    next(); // User has the required role, proceed
  };
};
