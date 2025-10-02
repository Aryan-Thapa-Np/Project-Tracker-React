
import type { Request, Response } from 'express';
import pool from '../../database/db.ts';

import type { AuthenticatedRequest } from "../../types/auth.types.ts";

import type { User } from "../../types/usersTypes.ts";

export const getUserDetailsController = async (req: Request, res: Response) => {
    try {

        const user_id = (req as AuthenticatedRequest).user.id;

        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id required" });

        }


        const [rows] = await pool.execute(
            `SELECT 
                user_id,
                profile_pic,
                username,
                email_verified,
                role,
                email,
                (SELECT COUNT(*) FROM notifications WHERE notifications.user_id = users.user_id AND is_read = false) AS notification_count
            FROM users
            WHERE user_id = ?`,
            [user_id]
        );




        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({ success: false, error: "User data not found." });

        }
        const user = (rows as User[])[0];

        res.status(200).json({ success: true, data: user, isAuth: true, message: "User found" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

