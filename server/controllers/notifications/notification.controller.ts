import type { Request, Response } from "express";
import pool from '../../database/db.ts';

import type { AuthenticatedRequest } from "../../types/auth.types.ts";
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { sanitizeInput } from "../../utils/sanitize.ts";


export const getNotificationsController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;
    const type = (req.query.type as string) || 'all';
    const search = (req.query.search as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    if (isNaN(user_id)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID.' });
    }

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?';
    const queryParams: (number | string)[] = [user_id];
    const countParams: (number | string)[] = [user_id];

    // Add search filter
    if (search) {
      query += ' AND (title LIKE ? OR project LIKE ?)';
      countQuery += ' AND (title LIKE ? OR project LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, sanitizeInput(searchPattern));
      countParams.push(searchPattern, sanitizeInput(searchPattern));
    }

    // Add type filter
    if (type === 'unread') {
      query += ' AND is_read = FALSE';
      countQuery += ' AND is_read = FALSE';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Execute queries
    const [rows] = await pool.query(query, queryParams);
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      notifications: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

export const markAsReadController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;
    const { id } = req.params;

    if (!user_id) {
      return res.status(401).json({ success: false, error: "User not authenticated." });
    }

    const [result] = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?",
      [id, user_id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found or not owned by user." });
    }

    res.status(200).json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export const markAllAsReadController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;

    if (!user_id) {
      return res.status(401).json({ success: false, error: "User not authenticated." });
    }

    const [result] = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: `Marked ${(result as ResultSetHeader).affectedRows} notifications as read.`,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export const deleteNotificationController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;
    const { id } = req.params;

    if (!user_id) {
      return res.status(401).json({ success: false, error: "User not authenticated." });
    }

    const [result] = await pool.query(
      "DELETE FROM notifications WHERE notification_id = ? AND user_id = ?",
      [id, user_id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found or not owned by user." });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};



interface Notification{
  notiCount: string;
}
export const getNotificationCountController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;


    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID Missing.' });
    }

    const [rows] = await pool.execute(`select count(*) as notiCount from notifications where user_id =? and is_read = false`, [user_id]);
    const notifications = (rows as Notification[])[0];
    res.status(200).json({
      success: true,
      notiCount: notifications.notiCount || 0,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
