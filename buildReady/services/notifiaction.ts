import pool from '../database/db';
import type { Request, Response } from 'express';
import type { User } from "../types/usersTypes";
import { validRoles } from "..//middleware/valiRoles";
import { emitNotificationToUser } from "./socket";
// Notification configuration using switch-case
function getNotificationConfig(type: string, titleName: string, project: string = "none") {
    switch (type) {
        case 'Task':
            return {
                icon_class: 'ClipboardCheck',
                title: `${titleName}`,
                project: `${project}`,

            };
        case 'project':
            return {
                icon_class: 'FolderKanban',
                title: `${titleName}`,
                project: `${project}`,

            };

        case 'Deadline':
            return {
                icon_class: 'clock',
                title: `Deadline approaching for: ${titleName}`,
                project: `${project}`

            };
        case 'user':
            return {
                icon_class: 'user',
                title: `${titleName}`

            };
        case 'new_member':
            return {
                icon_class: 'user',
                title: `New member: ${titleName} joined the team.`,
                project: `${project}`

            };
        case 'Document_update':
            return {
                icon_class: 'file',
                title: `Document updated: ${titleName}`,
                project: `${project}`

            };
        case 'announcement':
            return {
                icon_class: 'Megaphone',
                title: `Announcement : ${titleName}`
            };
        default:
            throw new Error('Invalid notification type');
    }
}


interface Noti {
    noticount: number;
}


export const pushNotifications = async (
    type: string,
    user_id: number,
    titleName: string,
    project: string = "none",
    role: string,
    reason: string = "normal",
    req: Request,
    res: Response
) => {
    try {

        if (!user_id || !titleName || !type) {
            return res.status(400).json({ success: false, error: "type, user_id & titleName required." });
        }

        const config = getNotificationConfig(type, titleName, project);

        // Special case: ANNOUNCEMENT
        if (reason === "announcement") {
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

        if (reason === "allUsers") {
            if (!validRoles.includes(role)) {
                return res.status(403).json({ success: false, error: "Not authorized to push Notifications." });
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

                const [result] = await pool.execute('select count(*) as noticount from notifications where user_id =? and is_read = false', [u.user_id]);
                const notifications = (result as Noti[])[0];

                emitNotificationToUser(u.user_id, notifications.noticount + 1);

            }

            return res.status(201).json({ success: true, message: "Notifications sent to all users." });
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




    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


