import express from "express";
import type { RequestHandler } from "express";

import {
   getUserTaskController,
   createTaskController,
   updateTaskStatusController,
   getTeamTasksController
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


router.get("/users/getMytask", normalLimiter, authenticateUserMiddleware, getUserTaskController as RequestHandler);

router.post("/users/assignTask", universalLimiter, verifyCsrfTokenMiddleware, authenticateUserMiddleware, checkPermission(["create_task"]), createTaskController as RequestHandler);

router.post("/users/updateTaskStatus", normalLimiter, authenticateUserMiddleware, updateTaskStatusController as RequestHandler);

router.get("/users/getAllTeamTasks", normalLimiter, authenticateUserMiddleware, getTeamTasksController as RequestHandler);


export default router;