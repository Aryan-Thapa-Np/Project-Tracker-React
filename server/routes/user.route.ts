import express from "express";
import type { RequestHandler } from "express";

import {
    getUsersController,
    createUserController,
    updateUsersController,
    getUsersNamesController
} from "../controllers/user.controller.ts";
import {
    createUserValidation,
    getUsersValidation,
    updateUsersValidation
} from "../middleware/validator.ts";
import {
    universalLimiter,
    normalLimiter
} from "../middleware/ratelimit.ts";

import {
    checkPermission
} from "../middleware/roleBaseAccess.middleware.ts";

import { verifyCsrfTokenMiddleware } from "../middleware/crf.middleware.ts";
import { authenticateUserMiddleware } from "../middleware/auth.middleware.ts";
import { upload } from "../services/multer.ts";
const router = express.Router();


router.get("/users/getAllUsers", normalLimiter, authenticateUserMiddleware, getUsersValidation, getUsersController as RequestHandler);

router.post("/users/createUsers", universalLimiter, verifyCsrfTokenMiddleware, authenticateUserMiddleware, createUserValidation, checkPermission(["create_users"]), createUserController as RequestHandler);

router.post("/users/updateUsers", verifyCsrfTokenMiddleware, authenticateUserMiddleware, updateUsersValidation,upload.single("profile_pic"),updateUsersController as RequestHandler);

router.get("/users/userNames", normalLimiter, authenticateUserMiddleware, getUsersNamesController as RequestHandler);



export default router;