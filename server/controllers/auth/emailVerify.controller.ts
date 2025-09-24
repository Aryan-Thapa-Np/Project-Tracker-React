
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.ts';


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


export const emailVerify = async (req: Request, res: Response) => {
    try {
        const { email, code, rememberMe = true } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, error: "Email & code required" });
        }

        const [rows] = await pool.execute(`SELECT * FROM users WHERE email=? AND otp_code =? AND otp_code_type=? AND code_expire > NOW()`, [email,code,"email_verification"]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid code" }); 
        }
    
        const user = (rows as User[])[0];



        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.cookie("Act", token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        if (rememberMe) {
            const refToken = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            const expire_time = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // current time + 7 days in ms


            await pool.execute(`update refresh_tokens set user_id= ?,token=? ,expires_at=?,revoked =?`, [user.user_id, refToken, expire_time, false])
            res.cookie("rft", refToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }

        res.status(200).json({ success: true, message:"Verification Successfull." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
