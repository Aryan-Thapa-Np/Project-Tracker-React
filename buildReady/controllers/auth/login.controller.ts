import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../database/db';
import { emailVerificationService } from "../../services/email";
import type { User } from "../../types/usersTypes";
import { insertLog } from "../../services/logger";


const statusTypes = ['banned', 'inactive'];
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES: number = 15;

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe = true } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }

        // Fetch user from database
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const user = rows[0] as User;

        // Check if account is banned or inactive
        if (statusTypes.includes(user.status)) {
            return res.status(401).json({
                success: false,
                error: 'Account banned. Please contact your admin for further instructions.',
            });
        }

        // Check if account is locked
        if (user.status === 'locked' && user.status_expire && new Date(user.status_expire) > new Date()) {
            const diffMs = new Date(user.status_expire).getTime() - new Date().getTime();
            const minutes = Math.ceil(diffMs / (1000 * 60));

            return res.status(401).json({
                success: false,
                error: `Account locked. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            let attempts = (user.attempts || 0) + 1;
            let lockUntil = null;
            let status = user.status;

            if (attempts >= MAX_LOGIN_ATTEMPTS) {
                lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
                status = 'locked';
                attempts = 0;
            }

            await pool.execute(
                'UPDATE users SET attempts = ?, status = ?, status_expire = ? WHERE user_id = ?',
                [attempts, status, lockUntil, user.user_id]
            );



            return res.status(401).json({
                success: false,
                error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - attempts} attempts remaining`,
            });
        }

    
        await pool.execute(
            'UPDATE users SET attempts = ?, status = ?, status_expire = ? WHERE user_id = ?',
            [0, 'active', null, user.user_id]
        );

        if (!user.email_verified) {
            const expire_code = new Date(Date.now() + 2 * 60 * 1000);
            const code: number = Math.floor(100000 + Math.random() * 900000);
            await pool.execute(
                'UPDATE users SET otp_code = ?, otp_code_type = ?, code_expire = ? WHERE user_id = ?',
                [code, 'email_verification', expire_code, user.user_id]
            );
            await emailVerificationService(email, code.toString());

            return res.status(200).json({
                success: true,
                isEmailVerified: false,
                message: 'Email verification required.',
            });
        }


        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        await insertLog(user.user_id, user.username, 0);


        res.cookie('act', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production', // Secure only in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        if (rememberMe) {
            const refToken = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            const expire_time = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await pool.execute(
                'INSERT INTO refresh_tokens (user_id, token, expires_at, revoked) VALUES (?, ?, ?, ?)',
                [user.user_id, refToken, expire_time, false]
            );

            res.cookie('ref', refToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        return res.status(200).json({ success: true, message: 'Login successful. Redirecting...' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
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

        const [rows] = await pool.execute(`insert into users(username,profile_pic,email,password)values(?,?,?)`, [username, "/image.png", email, hash]);



        res.status(200).json({ success: true, message: "Verification Successfull." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};




export const LogoutController = async (req: Request, res: Response) => {

    try {
        res.clearCookie('act', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.clearCookie('ref', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
