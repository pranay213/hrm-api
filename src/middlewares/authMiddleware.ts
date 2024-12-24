import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define the structure of the user payload in the JWT token
interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  roleType: string;
}

// Extend Express Request to include the `user` object
export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

// Middleware to authenticate requests using JWT
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.trim(); // Extract Authorization header

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token format.',
    });
    return; // Exit if token is not properly formatted
  }

  try {
    const secret = process.env.JWT_SECRET_KEY; // Ensure the secret is set
    if (!secret) {
      throw new Error('JWT secret key is not configured.');
    }

    const decoded = jwt.verify(token, secret) as JwtUserPayload; // Decode and cast to JwtUserPayload
    req.user = decoded; // Attach the decoded payload to the request
    next(); // Pass control to the next middleware
  } catch (err: any) {
    console.error('Token verification failed:', err);
    res
      .status(400)
      .json({ success: false, message: 'Invalid Token', error: err.message });
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
      res
        .status(403)
        .json({ success: false, message: 'Access denied. No token provided.' });
      return; // Ensure the function exits after sending the response
    }
    next(); // User has the required role, proceed
  };
};
