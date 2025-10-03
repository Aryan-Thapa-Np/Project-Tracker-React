import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import type { ResultSetHeader } from 'mysql2/promise';


interface Total {
    total: string;
}

export const getUserTaskController = async (req: Request, res: Response) => {
    console.log("yes");
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { page = "1", limit = "5", status, project_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id required" });
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;

        let baseQuery = "SELECT SQL_CALC_FOUND_ROWS * FROM tasks WHERE assigned_to = ?";
        const params: (string | number)[] = [user_id];

        if (project_id) {
            const pid = Number(project_id);
            if (isNaN(pid)) return res.status(400).json({ success: false, error: "Invalid project_id" });
            baseQuery += " AND project_id = ?";
            params.push(pid);
        }

        if (status) {
            baseQuery += " AND status = ?";
            params.push(status as string);
        }

        baseQuery += " ORDER BY due_date ASC LIMIT ? OFFSET ?";
        params.push(limitNum, offset);

        const [rows] = await pool.execute(baseQuery, params);
        const [totalRows] = await pool.query("SELECT FOUND_ROWS() as total");
        const total = (totalRows as Total[])[0];

        return res.status(200).json({
            success: true,
            tasks: rows,
            pagination: {
                total: parseInt(total.total),
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(parseInt(total.total) / limitNum),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const createTaskController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { project_id, milestone_id, assigned_to, task_name, due_date, status } = req.body;


        if (!user_id || !project_id || !status || !task_name || !assigned_to) {
            return res.status(400).json({ success: false, error: "user_id, project_id, assigned_to, task_name, and status are required" });
        }


        const pid = Number(project_id);
        const mid = milestone_id ? Number(milestone_id) : null;
        const assignee = Number(assigned_to);

        if (isNaN(pid) || isNaN(assignee) || (milestone_id && isNaN(mid!))) {
            return res.status(400).json({ success: false, error: "Invalid numeric value(s)" });
        }


        const [result] = await pool.execute(
            `INSERT INTO tasks (project_id, milestone_id, assigned_to, task_name, due_date, status, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [pid, mid, assignee, task_name, due_date || null, status, user_id]
        );


        res.status(201).json({ success: true, message: "Task created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



export const getTeamTasksController = async (req: Request, res: Response) => {
    try {
        // User must be authenticated
        const user_id = (req as AuthenticatedRequest).user.id;
        if (!user_id) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        // Query params
        const { project_id, status, assigned_to, due_date } = req.query;

        // Base query
        let baseQuery = "SELECT * FROM tasks WHERE 1=1";
        const params: (string | number)[] = [];

        // Filters
        if (project_id) {
            const pid = Number(project_id);
            if (isNaN(pid)) return res.status(400).json({ success: false, error: "Invalid project_id" });
            baseQuery += " AND project_id = ?";
            params.push(pid);
        }

        if (status && typeof status === "string") {
            baseQuery += " AND status = ?";
            params.push(status);
        }

        if (assigned_to) {
            const assigneeId = Number(assigned_to);
            if (isNaN(assigneeId)) return res.status(400).json({ success: false, error: "Invalid assigned_to" });
            baseQuery += " AND assigned_to = ?";
            params.push(assigneeId);
        }

        if (due_date && typeof due_date === "string") {
            baseQuery += " AND due_date = ?";
            params.push(due_date);
        }

        // Execute query
        const [rows] = await pool.execute(baseQuery, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(200).json({ success: true, tasks: [], message: "No tasks found." });
        }

        res.status(200).json({ success: true, tasks: rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const updateTaskStatusController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { task_id, status } = req.body;

        if (!task_id || !status) {
            return res.status(400).json({ success: false, error: "task_id & status required" });
        }

        if (!["To Do", "In Progress", "Completed"].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        const [result] = await pool.execute(
            "UPDATE tasks SET status = ? WHERE id = ? AND assigned_to = ?",
            [status, task_id, user_id]
        );

        if (!result || (result as ResultSetHeader).affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Task not found or not yours" });
        }

        return res.status(200).json({ success: true, message: "Task status updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};