import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from "../../types/auth.types.ts";

export const getUserTaskController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { project_id, status } = req.query;

        if (!user_id || !project_id || !status) {
            return res.status(400).json({ success: false, error: "user_id & project_id & status required" });
        }


        let baseQuery = "SELECT * FROM tasks WHERE assigned_to = ?";
        const params: (string | number)[] = [user_id];


        const pid = Number(project_id);
        if (!isNaN(pid)) {
            baseQuery += " AND project_id = ?";
            params.push(pid as number);
        } else {
            return res.status(400).json({ success: false, error: "Invalid project_id" });
        }

        if (status) {
            baseQuery += " AND status = ?";
            params.push(status as string);
        }

        const [rows] = await pool.execute(baseQuery, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(200).json({ success: true, tasks: false, message: "Currently no tasks are assigned to you." });
        }

        res.status(200).json({ success: true, tasks: rows });

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

   
        res.status(201).json({ success: true, message: "Task created successfully"});

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
