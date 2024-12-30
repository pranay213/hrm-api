import { Request, Response, NextFunction } from 'express';
import SessionsModel from '../models/Sessions';

interface AuthenticatedRequest extends Request {
  user?: {
    sessionId?: string;
  };
}

export const loginVerify = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.user || {};
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Session',
        sessionExpired: true,
      });
    }

    const session = await SessionsModel.findById(sessionId);
    console.log('session', session);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired',
        sessionExpired: true,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login verification',
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionExpired: true,
    });
  }
};
