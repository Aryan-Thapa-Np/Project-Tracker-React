import type { Response,Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  pool  from "../database/db.ts"; // Adjust the import path for your database config
import type { AuthenticatedRequest } from "../types/auth.types.ts"; 


interface User {
    user_id: number;
    username: string;
    password: string;
    role: string;
    email: string;
    email_verified: boolean;
    status: string;
    created_at: Date;

}

export const authenticateUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      email: string;
    };

    const [rows] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [
      decoded.userId,
    ]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const user = (rows as User[])[0];
    (req as AuthenticatedRequest).user = { id: user.user_id, email: user.email };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, error: "Authentication failed" });
  }
};