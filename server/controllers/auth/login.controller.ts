import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.ts';
import { emailVerificationService } from "../../services/email.ts";


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

export const loginController = async (req: Request, res: Response) => {
   
    try {
        const { email, password, rememberMe = true } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email & password required" });
        }



        const [rows] = await pool.execute(`Select * from users where email=?`, [email]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const user = (rows as User[])[0];

        console.log(user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        if (user.email_verified == false) {
            const expire_code = new Date(Date.now() + 2 * 60 * 1000);
            const code: number = Math.floor(100000 + Math.random() * 900000);
            await pool.execute(`update users set otp_code =?,otp_code_type=?,code_expire=? where user_id=?`, [code, "email_verification", expire_code, user.user_id])
            await emailVerificationService(email, code.toString());

            return res.status(400).json({ success: false, isEmailVerified: user.email_verified, message: "Email verification Required." });

        }


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

        res.status(200).json({ success: true, message: "Login Successfull. redirecting..." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};







export const regiii = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email & password required" });
        }


        const hash = await bcrypt.hash(password, 10);

        const [rows] = await pool.execute(`insert into users(username,email,password)values(?,?,?)`, [username, email, hash]);



        res.status(200).json({ success: true, message: "Verification Successfull." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
