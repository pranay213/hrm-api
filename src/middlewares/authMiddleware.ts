import Module from '../models/Modules';
import Account from '../models/Accounts';
import { loginVerify } from '../utils/sessions';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface JwtUserPayload extends JwtPayload {
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
    const findUser = await Account.findOne({ _id: req.user.id });
    const findModules = await Module.find(
      {
        _id: {
          $in: findUser?.permissions,
        },
      },
      {
        name: 1,
        _id: 0,
      },
    );
    const dbPermissions = findModules.map((each) => each?.name);

    // Check if the user has access to the requested route
    const requestedModule = req.baseUrl.split('/')[2]?.toLowerCase();
    console.log('requestredRoute', requestedModule);
    console.log('userPermissions', dbPermissions);

    if (!requestedModule || !dbPermissions.includes(requestedModule)) {
      res.status(403).json({
        success: false,
        message: 'you are not access to this route',
        redirect: true,
      });
      return;
    }
    await loginVerify(req, res, next);
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
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You are unable to access this resource.',
      });
      return; // Ensure the function exits after sending the response
    }

    next(); // User has the required role, proceed
  };
};
