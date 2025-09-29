import express from "express";
import type { RequestHandler } from "express";

import {
    createProjectController,
    getProjectsController,
    getProjectNamesController

} from "../controllers/others.controller.ts";
import {
    createTaskValidation,
    getTaskValidation
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

const router = express.Router();


router.get("/users/projects", normalLimiter, authenticateUserMiddleware, getTaskValidation, getProjectsController as RequestHandler);

router.post("/users/createtask", universalLimiter, checkPermission(["create_project"]), verifyCsrfTokenMiddleware, authenticateUserMiddleware, createTaskValidation, createProjectController as RequestHandler);


router.get("/users/projectsName", normalLimiter, authenticateUserMiddleware, getProjectNamesController as RequestHandler);



export default router;