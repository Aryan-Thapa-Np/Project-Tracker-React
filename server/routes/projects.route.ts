import express from "express";
import type { RequestHandler } from "express";

import {
    createProjectController,
    getProjectsController,
    getProjectNamesController,
    updateProjectController,
    getMilestoneNames,
    getSimpleProjectsController,
    deleteProjectController
} from "../controllers/others.controller.ts";
import {

    updateProjectValidator,
    getProjectsValidation,
    createProjectValidation,
    deleteProjectValidator
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

//Fetch all projects.
router.get("/users/projects", normalLimiter, authenticateUserMiddleware, getProjectsValidation, getProjectsController as RequestHandler);

router.post("/users/createProject", universalLimiter, verifyCsrfTokenMiddleware, authenticateUserMiddleware, createProjectValidation, checkPermission(["create_project"]), createProjectController as RequestHandler);


router.get("/users/projectsName", normalLimiter, authenticateUserMiddleware, getProjectNamesController as RequestHandler);

router.put("/users/updateProject", normalLimiter, verifyCsrfTokenMiddleware, authenticateUserMiddleware, updateProjectValidator, updateProjectController);
router.get("/users/milestones/:id", normalLimiter, authenticateUserMiddleware, getMilestoneNames as RequestHandler);

router.get("/users/Getprojects", normalLimiter, authenticateUserMiddleware, getSimpleProjectsController as RequestHandler);

router.delete("/users/deleteProject", universalLimiter, authenticateUserMiddleware, deleteProjectValidator, checkPermission(["delete_project"]), deleteProjectController as RequestHandler)


export default router;