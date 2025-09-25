import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.ts';
import { emailVerificationService } from "../../services/email.ts";
import { User } from "../../interface/users.ts";

const statusTypes = ["banned", "inactive"];

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

        if (statusTypes.includes(user.status)) {
            return res.status(401).json({ success: false, error: "Account banned. please contact your admin for further instructions." });

        }

        
        if (user.attempts >= 5 && user.status_expire && new Date(user.status_expire) > new Date()) {
            if (user.status !== "inactive") {
                await pool.execute(
                    `UPDATE users SET status = ?, attempts = ? WHERE user_id = ?`,
                    ["locked", null, user.user_id]
                );
                return res.status(401).json({
                    success: false,
                    error: `Account locked until ${user.status_expire}.`
                });
            }
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            let attempts = user.attempts + 1;
            let lockUntil = null;

            if (attempts >= 5) {
                lockUntil = new Date(Date.now() + 15 * 60 * 1000);
                attempts = 0;
            }

            await pool.execute(
                `UPDATE users 
                 SET attempts = ?, status = ?, status_expire = ? 
                 WHERE user_id = ?`,
                [attempts, "locked", lockUntil, user.user_id]
            );

            return res.status(401).json({ success: false, error: `Invalid credentials. ${user.attempts} attemps remanning` });
        }

        if (user.email_verified == false) {
            const expire_code = new Date(Date.now() + 2 * 60 * 1000);
            const code: number = Math.floor(100000 + Math.random() * 900000);
            await pool.execute(`update users set otp_code =?,otp_code_type=?,code_expire=? where user_id=?`, [code, "email_verification", expire_code, user.user_id])
            await emailVerificationService(email, code.toString());

            return res.status(200).json({ success: true, isEmailVerified: false, message: "Email verification Required." });

        }


        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.cookie("act", token, {
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


            await pool.execute(`insert into refresh_tokens(user_id,token ,expires_at,revoked) values(?,?,?,?)`, [user.user_id, refToken, expire_time, false])
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
