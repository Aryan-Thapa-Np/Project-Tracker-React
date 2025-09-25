import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import type { ResultSetHeader } from "mysql2/promise";

export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { status, date } = req.query;

        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id required" });
        }

        let baseQuery = `
            SELECT p.project_id, p.project_name, p.status AS project_status, p.progress_percentage, p.due_date AS project_due_date,
                   m.milestone_id, m.milestone_name, m.completed AS milestone_completed, m.due_date AS milestone_due_date
            FROM projects p
            LEFT JOIN milestones m ON m.project_id = p.project_id
            WHERE 1 = 1
        `;
        const params: (string | number)[] = [];


        if (status && typeof status === "string") {
            baseQuery += " AND p.status = ?";
            params.push(status);
        }


        if (date && typeof date === "string") {
            baseQuery += " AND p.due_date = ?";
            params.push(date);
        }

        const [rows] = await pool.execute(baseQuery, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(200).json({ success: true, projects: [], message: "No projects found." });
        }

        res.status(200).json({ success: true, projects: rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



export const createProjectController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { project_name, status, due_date, milestones } = req.body;


        if (!user_id || !project_name) {
            return res.status(400).json({
                success: false,
                error: "user_id and project_name are required"
            });
        }


        const validStatuses = ["on_track", "completed", "pending"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            });
        }


        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO projects (project_name, status, due_date) VALUES (?, ?, ?)`,
            [project_name, status || "pending", due_date || null]
        );

        const project_id = result.insertId;


        if (Array.isArray(milestones) && milestones.length > 0) {
            const milestoneValues: (string | number | boolean | null)[][] = milestones.map((m) => [
                project_id,
                m.milestone_name,
                m.completed ? 1 : 0,
                m.due_date || null
            ]);

            await pool.query(
                `INSERT INTO milestones (project_id, milestone_name, completed, due_date) VALUES ?`,
                [milestoneValues]
            );
        }

        res.status(201).json({
            success: true,
            message: "Project created successfully",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



export const getProjectNamesController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;



        if (!user_id) {
            return res.status(400).json({
                success: false,
                error: "user_id  are required"
            });
        }


        const [rows] = await pool.execute(`select project_name from projects `);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(201).json({
                success: false,
                error: "Projects not found..",

            });
        }

        res.status(201).json({
            success: true,
            projects: rows,
            message: "Project created successfully",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

