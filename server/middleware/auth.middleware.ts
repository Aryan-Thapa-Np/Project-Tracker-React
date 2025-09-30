import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../database/db.ts"; // Adjust the import path for your database config
import type { AuthenticatedRequest } from "../types/auth.types.ts";
import type { User } from "../types/usersTypes.ts";


export const authenticateUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {


    const act: string = req.cookies?.act;
    const ref: string = req.cookies?.ref;



    if (!act && !ref) {
      return res.status(401).json({ success: false, isAuth: false, error: "No token provided" });
    }

    if (act) {
      const decoded = jwt.verify(act, process.env.JWT_SECRET as string) as {
        id: number;
        email: string;
      };
      if (decoded) {


        const [rows] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [
          decoded.id,
        ]);

        if (!Array.isArray(rows) || rows.length === 0) {
          return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const user = (rows as User[])[0];
        (req as AuthenticatedRequest).user = { id: user.user_id, email: user.email, role: user.role };
        return next();
      }
    }

    if (ref) {
      const decoded = jwt.verify(ref, process.env.JWT_SECRET as string) as {
        id: number;
        email: string;
      };

      const [rows] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [
        decoded.id,
      ]);

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }

      const user = (rows as User[])[0];
      (req as AuthenticatedRequest).user = { id: user.user_id, email: user.email, role: user.role };

      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      res.cookie('act', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Secure only in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return next();
    }

    return res.status(401).json({ success: false, isAuth: false, error: "Invalid Or Expired Token!" });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, isAuth: false, error: "Authentication failed" });
  }
};