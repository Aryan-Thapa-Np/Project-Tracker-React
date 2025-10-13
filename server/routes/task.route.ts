import express from "express";
import type { RequestHandler } from "express";

import {
   getUserTaskController,
   createTaskController,
   updateTaskStatusController,
   getTeamTasksController,
   updateTaskController,
   deleteTaskController,
   getTeamProgressController
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
router.put("/users/updateTask", normalLimiter, authenticateUserMiddleware,checkPermission(["update_task"]), updateTaskController as RequestHandler);

router.delete("/users/updateTask", normalLimiter, authenticateUserMiddleware,checkPermission(["delete_task"]), deleteTaskController as RequestHandler);
router.get("/users/getTeamProgress", normalLimiter, authenticateUserMiddleware, getTeamProgressController as RequestHandler);


export default router;