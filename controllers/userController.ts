import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password, ...userData } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ ...userData, password: hashedPassword });
    res.status(201).json({ success: true, data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
