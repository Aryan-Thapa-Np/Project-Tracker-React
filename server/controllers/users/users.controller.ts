import pool from '../../database/db.ts';
import { response, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import type { QueryError } from "mysql2";
import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import path from "path";
import type { MulterRequest } from "../../types/multerTypes.ts";
import fs from "fs";
import { insertLog } from "../../services/logger.ts";
import { pushNotifications } from "../../services/notifiaction.ts";
import { request } from 'http';


export const getUsersController = async (req: Request, res: Response) => {
    try {
        const { search, role } = req.query;

        let baseQuery = `
            SELECT 
                user_id, 
                username, 
                email, 
                status, 
                role, 
                NULL AS profile_picture, 
                status_expire, 
                attempts, 
                email_verified 
            FROM users
            WHERE 1=1
        `;
        const params: (string | number)[] = [];


        if (search && typeof search === "string") {
            baseQuery += " AND (username LIKE ? OR email LIKE ?)";
            const searchValue = `%${search}%`;
            params.push(searchValue, searchValue);
        }

        if (role && typeof role === "string") {
            const validRoles = ["admin", "project_manager", "team_member"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ success: false, error: "Invalid role." });
            }
            baseQuery += " AND role = ?";
            params.push(role);
        }

        const [rows] = await pool.execute(baseQuery, params);

        res.status(200).json({
            success: true,
            users: Array.isArray(rows) ? rows : []
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};





export const updateUsersController = async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;
        const user_id = (req as AuthenticatedRequest).user.id;
        const username2 = (req as AuthenticatedRequest).user.username;
        const role = (req as AuthenticatedRequest).user.role;


        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id is required" });
        }

        const updates: string[] = [];
        const params: (string | number)[] = [];

        if (username) {
            updates.push("username = ?");
            params.push(username);
        }

        if (email) {

            const [rows] = await pool.execute(`select username,email from users where email =?`, [email]);
            if (!Array.isArray(rows) || rows.length !== 0) {
                return res.status(401).json({ success: false, error: 'Email already in use.' });
            }

            updates.push("email = ?,email_verified = false");
            params.push(email);
        }

        const multerReq = req as unknown as MulterRequest;
        if (multerReq.file) {
            const prevPic: string | undefined = (req as AuthenticatedRequest).user?.profile_pic;


            if (prevPic && typeof prevPic === "string") {
                try {

                    const oldFileName = path.basename(prevPic);
                    const oldFilePath = path.join("server/uploads", "user", String(user_id), oldFileName);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);

                    }

                } catch (err) {
                    console.error("Error deleting old profile pic:", err);
                }
            }

            const profilePicPath = `${process.env.VITE_BACKEND_URL || "http://localhost:4000"}/user/${user_id}/${multerReq.file.filename}`;
            updates.push("profile_pic = ?");
            params.push(profilePicPath);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: "No valid fields to update" });
        }

        params.push(user_id);

        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
        await pool.execute(query, params);

        insertLog(user_id, username2, 8);
        await pushNotifications("user", user_id, "Profile updated successfully", "none", role, req, res);

        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update user error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createUserController = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: "username, email, and password are required" });
        }

        // Optional: validate role
        const validRoles = ["admin", "project_manager", "team_member"];
        const userRole = role && validRoles.includes(role) ? role : "team_member";

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.execute(
            `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
            [username, email, hashedPassword, userRole]
        );

        res.status(201).json({ success: true, message: "User created successfully" });

    } catch (error) {
        const err = error as QueryError;
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ success: false, error: "Email already exists" });
        }

        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};





export const getUsersNamesController = async (req: Request, res: Response) => {

    try {
        const user_id = (req as AuthenticatedRequest).user.id;



        if (!user_id) {
            return res.status(400).json({
                success: false,
                error: "user_id  are required"
            });
        }


        const [rows] = await pool.execute(`select username from users `);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(201).json({
                success: false,
                error: "Users not found..",

            });
        }

        res.status(201).json({
            success: true,
            users: rows,
            message: "Project created successfully",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }

}