import express from "express";
import type { RequestHandler } from "express";

import {
    createProjectController,
    getProjectsController,
    getProjectNamesController,
    updateProjectController,
    getMilestoneNames
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


router.get("/users/projects", normalLimiter, authenticateUserMiddleware, getProjectsController as RequestHandler);

router.post("/users/createProject", verifyCsrfTokenMiddleware, authenticateUserMiddleware, checkPermission(["create_project"]), createProjectController as RequestHandler);


router.get("/users/projectsName", normalLimiter, authenticateUserMiddleware, getProjectNamesController as RequestHandler);

router.put("/users/updateProject", authenticateUserMiddleware, updateProjectController);
router.get("/users/milestones/:id", normalLimiter, authenticateUserMiddleware, getMilestoneNames as RequestHandler);




export default router;