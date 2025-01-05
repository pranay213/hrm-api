import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtUserPayload } from './authMiddleware';
dotenv.config();

export const updateToken = async (
  req: JwtUserPayload,
  res: Response,
): Promise<any> => {
  try {
    const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        role: req.user.roleType,
        sessionId: req.user.sessionId, // Store session ID in the token
      },
      JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );
    return token;
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: 'Invalid Token',
      error: err.message,
      sessionExpired: true,
    });
  }
};
