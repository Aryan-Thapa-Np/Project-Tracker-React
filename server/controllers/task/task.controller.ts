import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import type { ResultSetHeader } from 'mysql2/promise';


interface Total {
    total: string;
}

export const getUserTaskController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { page = "1", limit = "2", status, project_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ success: false, error: "user_id required" });
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;


        let baseQuery = "SELECT SQL_CALC_FOUND_ROWS *,(SELECT milestone_name FROM milestones WHERE milestone_id = tasks.milestone_id) AS milestone_name,(SELECT project_name FROM projects WHERE project_id = tasks.project_id) AS project_name  FROM tasks WHERE assigned_to = ?";
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
        const { project_id, milestone_id, assigned_to, task_name, due_date, priority, status = "todo" } = req.body;

        // Validate required fields
        if (!user_id || !project_id || !assigned_to || !task_name || !status || !priority) {
            return res.status(400).json({
                success: false,
                error: "user_id, project_id, assigned_to, task_name, status, and priority are required"
            });
        }

        // Validate priority
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!validPriorities.includes(priority.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: "Priority must be one of: low, medium, high, urgent"
            });
        }

        // Convert string IDs to numbers
        const pid = Number(project_id);
        const mid = milestone_id ? Number(milestone_id) : null;
        const assignee = Number(assigned_to);

        // Validate numeric conversions
        if (isNaN(pid) || isNaN(assignee) || (milestone_id && isNaN(mid!))) {
            return res.status(400).json({
                success: false,
                error: "Invalid numeric value(s) for project_id, milestone_id, or assigned_to"
            });
        }

        // Insert task into database
        const [result] = await pool.execute(
            `INSERT INTO tasks (project_id, milestone_id, assigned_to, task_name, due_date, status, priority) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [pid, mid, assignee, task_name, due_date || null, status, priority.toLowerCase()]
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

export const updateTaskController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { task_id, project_id, milestone_id, assigned_to, task_name, due_date, priority, status } = req.body;

        // Validate required fields
        if (!user_id || !task_id || !project_id || !assigned_to || !task_name || !status || !priority) {
            return res.status(400).json({
                success: false,
                error: "user_id, task_id, project_id, assigned_to, task_name, status, and priority are required"
            });
        }

        // Validate priority
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!validPriorities.includes(priority.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: "Priority must be one of: low, medium, high, urgent"
            });
        }

        // Validate status
        const validStatuses = ['todo', 'in_progress', 'completed'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: "Status must be one of: todo, in_progress, completed"
            });
        }

        // Convert string IDs to numbers
        const tid = Number(task_id);
        const pid = Number(project_id);
        const mid = milestone_id ? Number(milestone_id) : null;
        const assignee = Number(assigned_to);

        // Validate numeric conversions
        if (isNaN(tid) || isNaN(pid) || isNaN(assignee) || (milestone_id && isNaN(mid!))) {
            return res.status(400).json({
                success: false,
                error: "Invalid numeric value(s) for task_id, project_id, milestone_id, or assigned_to"
            });
        }

        // Check if task exists
        const [existingTask] = await pool.execute(
            'SELECT * FROM tasks WHERE task_id = ?',
            [tid]
        );

        if (!Array.isArray(existingTask) || existingTask.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        // Update task in database
        const [result] = await pool.execute(
            `UPDATE tasks 
             SET project_id = ?, milestone_id = ?, assigned_to = ?, task_name = ?, due_date = ?, status = ?, priority = ?
             WHERE task_id = ?`,
            [pid, mid, assignee, task_name, due_date || null, status.toLowerCase(), priority.toLowerCase(), tid]
        );

        res.status(200).json({
            success: true,
            message: "Task updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

export const getTeamTasksController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        if (!user_id) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const { project_id, status, assigned_to, due_date } = req.query;

        let baseQuery = `
            SELECT 
                tasks.*,
                (SELECT project_name FROM projects WHERE project_id = tasks.project_id) AS project_name,
                (SELECT profile_pic FROM users WHERE user_id = tasks.assigned_to) AS profile_pic,
                (SELECT milestone_name FROM milestones WHERE milestone_id = tasks.milestone_id) AS milestone_name,
                (SELECT username FROM users WHERE user_id = tasks.assigned_to) AS username

            FROM tasks 
            WHERE 1=1
        `;
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

interface Milestone {
    milestone_id: string;
    project_id: string;
}

export const updateTaskStatusController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { task_id, status } = req.body;

        if (!task_id || !status) {
            return res.status(400).json({ success: false, error: "task_id & status required" });
        }

        if (!["todo", "in_progress", "completed"].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }
        let totalMilestones = 0;
        let completedCount = 0;

        const [data] = await pool.execute(`select milestone_id,project_id from tasks where task_id =?`, [task_id]);
        const finalData = (data as Milestone[])[0];
        const [result] = await pool.execute(
            "UPDATE tasks SET status = ? WHERE task_id = ? AND assigned_to = ?",
            [status, task_id, user_id]
        );

        if (status === "completed") {
            const [result2] = await pool.execute(
                "UPDATE milestones SET completed = true WHERE milestone_id = ? ",
                [finalData.milestone_id]
            );


            const [countsRows] = await pool.execute(
                `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
       FROM milestones
       WHERE project_id = ?`,
                [finalData.project_id]
            );

            const counts: { total: number; completed: number } = Array.isArray(countsRows) && countsRows.length > 0
                ? (countsRows[0] as { total: number; completed: number })
                : { total: 0, completed: 0 };
            totalMilestones = Number(counts.total || 0);
            completedCount = Number(counts.completed || 0);

            const progress_percentage = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
            await pool.execute(`UPDATE projects SET progress_percentage = ? WHERE project_id = ?`, [progress_percentage, finalData.project_id]);

        } else {
            const [result3] = await pool.execute(
                "UPDATE milestones SET completed = false WHERE milestone_id = ? ",
                [finalData.milestone_id]
            );
        }

        if (!result || (result as ResultSetHeader).affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Task not found or not yours" });
        }

        return res.status(200).json({ success: true, message: "Task status updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



export const deleteTaskController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { task_id } = req.body;

        if (!task_id || !user_id) {
            return res.status(400).json({ success: false, error: "task_id & user_id required" });
        }

        const [result] = await pool.execute(`delete from tasks where task_id=? `,[task_id]);
     
        if (!result || (result as ResultSetHeader).affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Failed to delete task." });
        }

        return res.status(200).json({ success: true, message: "Task was deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};