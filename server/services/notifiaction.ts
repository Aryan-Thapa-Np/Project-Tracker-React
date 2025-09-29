import pool from '../database/db.ts';
import type { Request, Response } from 'express';
import type { User } from "../types/usersTypes.ts";

// Notification configuration using switch-case
function getNotificationConfig(type: string, titleName: string, project: string = "none") {
    switch (type) {
        case 'Task':
            return {
                icon_class: 'faFileAlt',
                title: `New task assigned: ${titleName}`,
                project: `${project}`,

            };
        case 'Deadline':
            return {
                icon_class: 'faClock',
                title: `Deadline approaching for: ${titleName}`,
                project: `${project}`

            };
        case 'user':
            return {
                icon_class: 'faUser',
                title: `${titleName}`

            };
        case 'new_member':
            return {
                icon_class: 'faUsers',
                title: `New member: ${titleName} joined the team.`,
                project: `${project}`

            };
        case 'Document_update':
            return {
                icon_class: 'faFileAlt',
                title: `Document updated: ${titleName}`,
                project: `${project}`

            };
        case 'announcement':
            return {
                icon_class: 'faBullhorn',
                title: `Announcement : ${titleName}`
            };
        default:
            throw new Error('Invalid notification type');
    }
}

export const pushNotifications = async (
    type: string,
    user_id: number,
    titleName: string,
    project: string = "none",
    role: string, 
    req: Request,
    res: Response
) => {
    try {
        if (!user_id || !titleName || !type) {
            return res.status(400).json({ success: false, error: "type, user_id & titleName required." });
        }

        const config = getNotificationConfig(type, titleName, project);

        // Special case: ANNOUNCEMENT
        if (type === "announcement") {
            // Only admins and project managers allowed
            if (role !== "admin" && role !== "project_manager") {
                return res.status(403).json({ success: false, error: "Not authorized to push announcements." });
            }

            // Fetch all users
            const [users] = await pool.execute("SELECT user_id FROM users");

            // Insert for each user
            const query = `
                INSERT INTO notifications (user_id, type, title, project, icon_class)
                VALUES (?, ?, ?, ?, ?)
            `;

            for (const u of users as User[]) {
                await pool.execute(query, [
                    u.user_id,
                    type,
                    config.title,
                    config.project ?? "none",
                    config.icon_class
                ]);
            }

            return res.status(201).json({ success: true, message: "Announcement sent to all users." });
        }

        // Normal notification
        const query = `
            INSERT INTO notifications (user_id, type, title, project, icon_class)
            VALUES (?, ?, ?, ?, ?)
        `;

        await pool.execute(query, [
            user_id,
            type,
            config.title,
            config.project ?? "none",
            config.icon_class
        ]);

        res.status(201).json({ success: true, message: "Notification added." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
