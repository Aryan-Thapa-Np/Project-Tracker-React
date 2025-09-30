import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from "../types/auth.types";

export const rolesPermissions: Record<string, string[]> = {
    project_manager: ["create_task", "create_project", "get_logs"],
    admin: ["create_task", "create_project", "create_users", "get_logs"],
    team_member: ["ws5523sdfo"],
    team_memberPlus: ["get_logs"],
    team_memberSuper: ["get_logs", "create_task"],
};

export const checkPermission = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = (req as AuthenticatedRequest).user.role;

            const rolePermission = rolesPermissions[userRole] || [];

            const hasPermission = requiredPermissions.every(p => rolePermission.includes(p));

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    isAuth: false,
                    error: "Forbidden: insufficient permissions"
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                isAuth: false,
                error: "Internal Server Error"
            });
        }
    };
};
