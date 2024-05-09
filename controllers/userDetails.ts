import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    // Decode the token to access the claims
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    // Extract user ID from the decoded token
    const userId = decodedToken.userId;

    // Fetch user details from the database
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Send user details back to the frontend
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
