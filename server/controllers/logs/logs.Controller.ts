import type { Request, Response } from 'express';
import pool from '../../database/db.ts';

import { escapeForSQL } from "../../utils/sanitize.ts";

export const getLogsController = async (req: Request, res: Response) => {

    try {
        // Extract & sanitize
        let { limit = "20", offset = "0", search = "", startDate, endDate } = req.query;

        limit = escapeForSQL(String(limit));
        offset = escapeForSQL(String(offset));
        search = escapeForSQL(String(search));
        startDate = startDate ? escapeForSQL(String(startDate)) : undefined;
        endDate = endDate ? escapeForSQL(String(endDate)) : undefined;

        // Validation
        if (isNaN(Number(limit)) || isNaN(Number(offset))) {
            return res.status(400).json({ error: "Invalid pagination values" });
        }

        // Base query
        let query = `
      SELECT l.id, l.user_id, l.username, l.action, l.created_at
      FROM logs l
      JOIN users u ON l.user_id = u.user_id
      WHERE 1=1
    `;
        const params: unknown[] = [];

        if (search) {
            query += " AND (u.username LIKE ? OR l.action LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        if (startDate) {
            query += " AND l.created_at >= ?";
            params.push(startDate);
        }

        if (endDate) {
            query += " AND l.created_at <= ?";
            params.push(endDate);
        }

        query += " ORDER BY l.created_at DESC LIMIT ? OFFSET ?";
        params.push(Number(limit), Number(offset));

        const [rows] = await pool.execute(query, params);
       
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Something went wrong!" });
    }

}