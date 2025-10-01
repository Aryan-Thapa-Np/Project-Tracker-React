import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";
import type { AuthenticatedRequest } from "../types/auth.types";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//file 
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];


const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG, PNG, JPG, and WEBP images are allowed!"));
    }
    cb(null, true);
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.body.uploadType || "users";
        const userId = (req as AuthenticatedRequest).user?.id || "general";


        const uploadPath = path.join(__dirname, `../uploads/${uploadType}/${userId}`);


        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `photo${ext}`);
    }
});
// Multer config
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200 MB max
    },
});
