import pool from '../../database/db.ts';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import type { ResultSetHeader } from "mysql2/promise";

export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const { status, date } = req.query;

        let baseQuery = `
      SELECT p.project_id, p.project_name, p.status AS project_status, p.progress_percentage,
             p.due_date AS project_due_date,
             m.milestone_id, m.milestone_name, m.completed AS milestone_completed, m.due_date AS milestone_due_date
      FROM projects p
      LEFT JOIN milestones m ON m.project_id = p.project_id
      WHERE 1=1
    `;
        const params: (string | number)[] = [];

        if (status && typeof status === "string") {
            baseQuery += " AND p.status = ?";
            params.push(status);
        }

        if (date && typeof date === "string") {
            // Expect date in YYYY-MM-DD or YYYY-MM format
            if (date.match(/^\d{4}-\d{2}$/)) {
                // Filter by year and month (e.g., 2025-10)
                baseQuery += " AND DATE_FORMAT(p.due_date, '%Y-%m') = ?";
                params.push(date);
            } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                // Filter by exact date
                baseQuery += " AND DATE(p.due_date) = ?";
                params.push(date);
            } else {
                return res.status(400).json({ success: false, error: "Invalid date format. Use YYYY-MM-DD or YYYY-MM." });
            }
        }

        const [rows] = await pool.execute(baseQuery, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(200).json({ success: true, projects: [], message: "No projects found." });
        }

        res.status(200).json({ success: true, projects: rows });
    } catch (error) {
        console.error("getProjects error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updateProjectController = async (req: Request, res: Response) => {
    const conn = await pool.getConnection();
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { project_id, project_name, status, due_date, milestones, removed_milestone_ids } = req.body;

        if (!user_id || !project_id) {
            return res.status(400).json({ success: false, error: "user & project_id required" });
        }

        const validStatuses = ["on_track", "completed", "pending"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        await conn.beginTransaction();

        const updates: string[] = [];
        const params: (string | number)[] = [];

        if (project_name !== undefined) {
            updates.push("project_name = ?");
            params.push(project_name);
        }
        if (status !== undefined) {
            updates.push("status = ?");
            params.push(status);
        }
        if (due_date !== undefined) {
            updates.push("due_date = ?");
            params.push(due_date || null);
        }

        if (updates.length > 0) {
            const sql = `UPDATE projects SET ${updates.join(", ")} WHERE project_id = ?`;
            params.push(project_id);
            await conn.execute(sql, params);
        }

        if (Array.isArray(removed_milestone_ids) && removed_milestone_ids.length > 0) {
            const placeholders = removed_milestone_ids.map(() => '?').join(',');
            await conn.execute(`DELETE FROM milestones WHERE milestone_id IN (${placeholders})`, removed_milestone_ids);
        }

        let totalMilestones = 0;
        let completedCount = 0;

        if (Array.isArray(milestones)) {
            for (const m of milestones) {
                if (m.milestone_id) {
                    await conn.execute(
                        `UPDATE milestones SET milestone_name = ?, completed = ?, due_date = ? WHERE milestone_id = ?`,
                        [m.milestone_name, m.completed ? 1 : 0, m.due_date || null, m.milestone_id]
                    );
                } else {
                    const [r] = await conn.execute<ResultSetHeader>(
                        `INSERT INTO milestones (project_id, milestone_name, completed, due_date) VALUES (?, ?, ?, ?)`,
                        [project_id, m.milestone_name, m.completed ? 1 : 0, m.due_date || null]
                    );
                }
            }
        }

        const [countsRows] = await conn.execute(
            `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
       FROM milestones
       WHERE project_id = ?`,
            [project_id]
        );

        const counts: { total: number; completed: number } = Array.isArray(countsRows) && countsRows.length > 0
            ? (countsRows[0] as { total: number; completed: number })
            : { total: 0, completed: 0 };
        totalMilestones = Number(counts.total || 0);
        completedCount = Number(counts.completed || 0);

        const progress_percentage = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
        await conn.execute(`UPDATE projects SET progress_percentage = ? WHERE project_id = ?`, [progress_percentage, project_id]);

        const [rows] = await conn.execute(
            `
      SELECT p.project_id, p.project_name, p.status as project_status,
             p.progress_percentage, p.due_date as project_due_date,
             m.milestone_id, m.milestone_name, m.completed as milestone_completed,
             m.due_date as milestone_due_date
      FROM projects p
      LEFT JOIN milestones m ON m.project_id = p.project_id
      WHERE p.project_id = ?
      `,
            [project_id]
        );

        await conn.commit();

        return res.json({ success: true, projectRows: rows, message: "Project updated" });
    } catch (err) {
        await conn.rollback();
        console.error("updateProject error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    } finally {
        conn.release();
    }
};


export const createProjectController = async (req: Request, res: Response) => {
    const conn = await pool.getConnection();
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const { project_name, status, due_date, milestones } = req.body;

        if (!user_id || !project_name) {
            return res.status(400).json({ success: false, error: "user_id and project_name are required" });
        }

        const validStatuses = ["on_track", "completed", "pending"];
        const finalStatus = status && validStatuses.includes(status) ? status : "pending";

        await conn.beginTransaction();

        const [projectResult] = await conn.execute<ResultSetHeader>(
            `INSERT INTO projects (project_name, status, due_date)
       VALUES (?, ?, ?)`,
            [project_name, finalStatus, due_date || null]
        );

        const project_id = projectResult.insertId;

        let totalMilestones = 0;
        let completedCount = 0;

        interface MilestoneInput {
            milestone_name: string;
            completed?: boolean;
            due_date?: string | null;
        }

        if (Array.isArray(milestones) && milestones.length > 0) {
            const milestoneValues = (milestones as MilestoneInput[]).map((m) => {
                totalMilestones++;
                if (m.completed) completedCount++;
                return [project_id, m.milestone_name, m.completed ? 1 : 0, m.due_date || null];
            });

            await conn.query(
                `INSERT INTO milestones (project_id, milestone_name, completed, due_date) VALUES ?`,
                [milestoneValues]
            );
        }

        // compute progress percentage
        const progress_percentage = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
        await conn.execute(`UPDATE projects SET progress_percentage = ? WHERE project_id = ?`, [progress_percentage, project_id]);

        // fetch created project rows (project + milestones)
        const [rows] = await conn.execute(
            `
      SELECT p.project_id, p.project_name, p.status as project_status,
             p.progress_percentage, p.due_date as project_due_date,
             m.milestone_id, m.milestone_name, m.completed as milestone_completed,
             m.due_date as milestone_due_date
      FROM projects p
      LEFT JOIN milestones m ON m.project_id = p.project_id
      WHERE p.project_id = ?
      `,
            [project_id]
        );

        await conn.commit();

        return res.status(201).json({ success: true, projectRows: rows });
    } catch (error) {
        await conn.rollback();
        console.error("createProject error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    } finally {
        conn.release();
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


        const [rows] = await pool.execute(`select project_name,project_id from projects `);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(201).json({
                success: false,
                error: "Projects not found..",

            });
        }

        res.status(201).json({
            success: true,
            projects: rows,
            message: "Success",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



export const getMilestoneNames = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const project_id = req.params.id;


        if (!user_id || !project_id) {
            return res.status(400).json({
                success: false,
                error: "User_id or project_id  are required"
            });
        }


        const [rows] = await pool.execute(`select milestone_name,milestone_id from milestones where project_id =? `, [project_id]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(201).json({
                success: false,
                error: "Milestones not found..",

            });
        }

        res.status(201).json({
            success: true,
            milestones: rows,
            message: "Success",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const getSimpleProjectsController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;

        if (!user_id) {
            return res.status(404).json({
                success: false,
                error: "unauthorized",

            });
        }

        const limit = 5;
        const [rows] = await pool.execute(`
        SELECT * 
        FROM projects 
        WHERE status != ?
        ORDER BY due_date ASC 
        LIMIT ?
        `, ["completed", limit]);



        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(201).json({
                success: false,
                error: "projects not found..",

            });
        }

        res.status(200).json({
            success: true,
            projects: rows,
            message: "Success",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const deleteProjectController = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const {project_id} = req.body;


        if (!user_id || !project_id) {
            return res.status(400).json({
                success: false,
                error: "User_id or project_id  are required"
            });
        }


        const [rows] = await pool.execute(`delete from projects where project_id=? `, [project_id]);
        if (!rows|| (rows as ResultSetHeader).affectedRows === 0) {
            return res.status(201).json({
                success: false,
                error: "Project not found..",

            });
        }

        res.status(200).json({
            success: true,
            message: "Success",

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
