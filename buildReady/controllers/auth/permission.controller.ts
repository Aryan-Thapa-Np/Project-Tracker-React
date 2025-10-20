
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from "../../types/auth.types";

export const permissionSendController = async (req: Request, res: Response) => {

    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        if (!user_id) {
            return res.status(400).json({ success: false, isAuth: false, isAllowedPerm: false, error: "User_id required" });

        }

        res.status(200).json({ success: true, isAuth: true, isAllowedPerm: true, message: "Authenticated." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, isAuth: false, isAllowedPerm: false, error: "Internal Server Error" });
    }
}