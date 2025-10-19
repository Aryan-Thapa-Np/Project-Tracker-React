import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import type { QueryError, ResultSetHeader } from "mysql2";
import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import path from "path";
import type { MulterRequest } from "../../types/multerTypes.ts";
import fs from "fs";
import { insertLog } from "../../services/logger.ts";
import { pushNotifications } from "../../services/notifiaction.ts";
import type { User } from "../../types/usersTypes.ts";
import { sanitizeInput } from "../../utils/sanitize.ts";
import { emitNotificationToUser } from "../../services/socket.ts";

import { validRoles } from "../../middleware/valiRoles.ts";

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const { search, role, status, page = "1", limit = "5" } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;

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
            params.push(searchValue, sanitizeInput(searchValue));
        }

        if (role && typeof role === "string") {
            const validRoles2 = validRoles;
            if (!validRoles2.includes(role)) {
                return res.status(400).json({ success: false, error: "Invalid role." });
            }


            baseQuery += " AND role = ?";
            params.push(role);
        }

        if (status && typeof status === "string") {
            const validStatuses = ["active", "locked", "banned", "inactive"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, error: "Invalid status." });
            }
            baseQuery += " AND status = ?";
            params.push(status);
        }

        const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) AS count_table`;
        const [countRows] = await pool.execute(countQuery, params);
        const total = (countRows as { total: number }[])[0].total;

        baseQuery += " LIMIT ? OFFSET ?";
        params.push(pageSize, offset);

        const [rows] = await pool.execute(baseQuery, params);

        res.status(200).json({
            success: true,
            users: Array.isArray(rows) ? rows : [],
            total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};





export const updateUserController = async (req: Request, res: Response) => {
    try {
        const { user_id, status, status_expire, role, email_verified } = req.body;
        const user_role = (req as AuthenticatedRequest).user.role;
        const user_id2 = (req as AuthenticatedRequest).user.id;
        const noticount = (req as AuthenticatedRequest).user.notification_count;

        const username2 = (req as AuthenticatedRequest).user.username;

        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id is required" });
        }

        // Validate status
        const validStatuses = ["locked", "active", "banned", "inactive"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        // Validate role
        const validRoles2 = validRoles;
        if (role && !validRoles2.includes(role)) {
            return res.status(400).json({ success: false, error: "Invalid role" });
        }

        const [rows] = await pool.execute(`select role,username from users where user_id =?`, [user_id]);
        const user = (rows as User[])[0];


        if (user.role === "admin") {
            if (user_role !== "admin") {
                return res.status(400).json({ success: false, error: "Insufficient Permission.." });
            }
        }
        if (role === "admin") {
            if (user_role !== "admin") {

                return res.status(400).json({ success: false, error: "Insufficient Permission.." });
            }
        }

        // If status is locked or banned, status_expire must be provided
        if ((status === "locked" || status === "banned") && !status_expire) {
            return res.status(400).json({ success: false, error: "status_expire is required for locked/banned users" });
        }

        // Build dynamic query
        const updates: string[] = [];
        const params: (string | number | boolean | null)[] = [];

        if (status) {
            updates.push("status = ?");
            params.push(status);
        }

        if (status_expire) {
            updates.push("status_expire = ?");
            params.push(status_expire);
        }

        if (role) {
            updates.push("role = ?");
            params.push(role);
        }


        if (typeof email_verified === "boolean") {
            updates.push("email_verified = ?");
            params.push(email_verified);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: "No fields to update" });
        }

        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
        params.push(user_id);

        const [result] = await pool.execute(query, params);

        insertLog(user_id2, username2, 8, `Username : ${user.username} with Id : ${user_id}`);
        await pushNotifications("user", user_id, ` Profile was updated successfully by ${username2}`, "none", user_role, "normal", req, res);
        emitNotificationToUser(user_id, noticount + 1);

        res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {
        const err = error as QueryError;
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const updateUserSelfController = async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;
        const user_id = (req as AuthenticatedRequest).user.id;
        const username2 = (req as AuthenticatedRequest).user.username;
        const role = (req as AuthenticatedRequest).user.role;
        const noticount = (req as AuthenticatedRequest).user.notification_count;





        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id is required" });
        }

        const updates: string[] = [];
        const params: (string | number)[] = [];

        if (username) {
            updates.push("username = ?");
            params.push(sanitizeInput(username));
        }

        if (email) {

            const [rows] = await pool.execute(`select username, email from users where email =? `, [email]);
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

        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ? `;
        await pool.execute(query, params);

        insertLog(user_id, username2, 8, "User");

        await pushNotifications("user", user_id, "Profile updated successfully", "none", role, "normal", req, res);

        emitNotificationToUser(user_id, noticount + 1);

        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update user error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createUserController = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;
        const username2 = (req as AuthenticatedRequest).user.username;
        const user_id = (req as AuthenticatedRequest).user.id;

        const user_role = (req as AuthenticatedRequest).user.role;
        const noticount = (req as AuthenticatedRequest).user.notification_count;


        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: "username, email, and password are required" });
        }

        // Optional: validate role
        const validRoles2 = validRoles;
        const userRole = role && validRoles2.includes(role) ? role : "team_member";

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO users(username, email, password, role) VALUES(?, ?, ?, ?)`,
            [sanitizeInput(username), email, hashedPassword, userRole]
        );

        const id = result.insertId;

        insertLog(user_id, username2, 10, `Username : ${username} with Id : ${id} was created successfully`);

        await pushNotifications("new_member", user_id, `${username}`, "none", user_role, "allUsers", req, res);

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


        const [rows] = await pool.execute(`select username, user_id from users`);
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