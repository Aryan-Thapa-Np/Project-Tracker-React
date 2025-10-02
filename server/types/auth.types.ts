
import type { Request } from "express";


export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email?: string;
        role: string;
        profile_pic: string;
        username:string;
    };
}