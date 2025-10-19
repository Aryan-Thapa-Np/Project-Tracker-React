
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.ts';
import type { User } from "../../types/usersTypes.ts";
import { emailVerificationService } from "../../services/email.ts";
import type { ResultSetHeader } from 'mysql2/promise';
import { insertLog } from "../../services/logger.ts";




export const emailVerifyController = async (req: Request, res: Response) => {
    try {
        const { email, code, rememberMe = true } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, error: "Email & code required" });
        }

        const [rows] = await pool.execute(`SELECT * FROM users WHERE email=? AND otp_code =? AND otp_code_type=? AND code_expire > NOW()`, [email, code, "email_verification"]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid or Expired code!" });
        }

        const user = (rows as User[])[0];


        const [update] = await pool.execute(`UPDATE users SET email_verified = ? where user_id =?`, [true, user.user_id]);
        if (!update || (update as ResultSetHeader).affectedRows === 0) {
            return res.status(401).json({ success: false, error: "Failed to update status." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

         insertLog(user.user_id, user.username, 1)


        res.cookie('act', token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === 'production', // Secure only in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });


        if (rememberMe) {
            const refToken = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            const expire_time = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // current time + 7 days in ms


            await pool.execute(`insert into refresh_tokens(user_id,token ,expires_at,revoked) values(?,?,?,?)`, [user.user_id, refToken, expire_time, false])

            res.cookie('ref', refToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production', // Secure only in production
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        res.status(200).json({ success: true, message: "Verification Successfull." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const resendEmailController = async (req: Request, res: Response) => {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: "Email required" });

        }
        const expire_code = new Date(Date.now() + 2 * 60 * 1000);
        const code: number = Math.floor(100000 + Math.random() * 900000);
        await pool.execute(`update users set otp_code =?,otp_code_type=?,code_expire=? where email=?`, [code, "email_verification", expire_code, email])
        await emailVerificationService(email, code.toString());

    

        res.status(200).json({ success: true, message: "Verification code resent successfully." });



    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}