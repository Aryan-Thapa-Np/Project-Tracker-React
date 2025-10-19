import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';





export const createCsrfTokenMiddleware = async (req: Request, res: Response) => {
    try {
        const csrfToken = crypto.randomBytes(32).toString('hex');

        
        res.cookie('csrfToken', csrfToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            httpOnly: true
        });
        
        res.json({
            success: true,
            csrfToken,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}



export const verifyCsrfTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const csrfToken = req.cookies?.csrfToken;
        const csrfHeaderToken = req.headers['x-csrf-token'];

 


        if (!csrfToken || !csrfHeaderToken) {
            return res.status(400).json({
                success: false,
                error: 'Missing CSRF Token',
            });
        }

        if (csrfToken !== csrfHeaderToken) {
            return res.status(400).json({
                success: false,
                error: 'Invalid CSRF Token',
            });
        }


        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}