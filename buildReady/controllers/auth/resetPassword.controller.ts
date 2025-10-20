import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../../database/db';
import type { ResultSetHeader } from 'mysql2/promise';
import { passwordChangeReqService } from "../../services/email";
import type { AuthenticatedRequest } from "../../types/auth.types";
import type { User } from "../../types/usersTypes";




export const reqResetPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: "Email required" });
        }

        const [rows] = await pool.execute(`Select * from users where email=?`, [email]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }


        const user = (rows as User[])[0];

        if (!user.email_verified) {
            return res.status(400).json({ success: false, error: "Email not verified!" });

        }
        const expire_time = new Date(Date.now() + 3 * 60 * 1000);


        const code: number = Math.floor(100000 + Math.random() * 900000);
        await pool.execute(`update users set otp_code =?,otp_code_type=?,code_expire=? where user_id=?`, [code, "password_reset", expire_time, user.user_id])
        await passwordChangeReqService(email, code.toString());





        res.status(200).json({
            success: true,
            message: "Enter the 6 digits code that have been sent to your email. Please check your inbox."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const ResetPasswordController = async (req: Request, res: Response) => {
    try {
        const { newPassword, email, code } = req.body;


        if (!email || !code || !newPassword) {
            return res.status(400).json({ success: false, error: "Email & Token & Password required" });
        }

        const [rows] = await pool.execute(
            `SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_code_type = ? AND code_expire > NOW()`,
            [email, code, "password_reset"]
        );
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid  or expired code!" });
        }

        const user = (rows as User[])[0];

        const hashPassword = await bcrypt.hash(newPassword, 10);


        const [updatePassword] = await pool.execute(`update users set password = ? where email=?`, [hashPassword, user.email]);

        if (!updatePassword || (updatePassword as ResultSetHeader).affectedRows === 0) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        res.clearCookie("act", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "lax" });
        res.clearCookie("rft", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "lax" });


        res.status(200).json({
            success: true,
            message: "Password reset successfully. redirecting to login..."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const ResetSettingPasswordController = async (req: Request, res: Response) => {
    try {
        const { password, confirmPassword } = req.body;

        const user_id = (req as AuthenticatedRequest).user.id;

        if (!confirmPassword || !password) {
            return res.status(400).json({ success: false, error: "New password required" });
        }

        const [rows] = await pool.execute(`Select * from users where user_id =?`, [user_id]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const user = (rows as User[])[0];
        const hashPassword = await bcrypt.hash(password, 10);

        const [updatePassword] = await pool.execute(`update users set password = ? where email=?`, [hashPassword, user.email]);


        if (!updatePassword || (updatePassword as ResultSetHeader).affectedRows === 0) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }



        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
