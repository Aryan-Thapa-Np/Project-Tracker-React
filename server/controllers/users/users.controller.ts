import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import type { QueryError } from "mysql2";

import type { AuthenticatedRequest } from "../../types/auth.types.ts";


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
        const { user_id, email_verified, attempts, status, status_expire, role } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id is required" });
        }

        const updates: string[] = [];
        const params: (string | number | boolean | null)[] = [];

        if (typeof email_verified === "boolean") {
            updates.push("email_verified = ?");
            params.push(email_verified);
        }

        if (typeof attempts === "number") {
            updates.push("attempts = ?");
            params.push(attempts);
        }

        if (status) {
            const validStatus = ["active", "locked", "inactive", "banned"];
            if (!validStatus.includes(status)) {
                return res.status(400).json({ success: false, error: "Invalid status" });
            }
            updates.push("status = ?");
            params.push(status);
        }

        if (status_expire) {
            const expireDate = new Date(status_expire);
            if (isNaN(expireDate.getTime())) {
                return res.status(400).json({ success: false, error: "Invalid status_expire date" });
            }


            const mysqlDate = expireDate.toISOString().slice(0, 19).replace("T", " ");
            updates.push("status_expire = ?");
            params.push(mysqlDate);
        }
        if (role) {
            const validRoles = ["admin", "project_manager", "team_member"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ success: false, error: "Invalid role" });
            }
            updates.push("role = ?");
            params.push(role);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: "No valid fields to update" });
        }

        params.push(user_id);
        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
        await pool.execute(query, params);

        res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
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