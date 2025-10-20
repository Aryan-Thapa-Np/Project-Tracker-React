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
} from "../controllers/others.controller";


import {
   createTaskValidation,
   getTaskValidation,
   updateTaskStatusValidator,
   updateTaskValidator,
   deleteTaskValidator
} from "../middleware/validator";


import {
   universalLimiter,
   normalLimiter
} from "../middleware/ratelimit";

import {
   checkPermission
} from "../middleware/roleBaseAccess.middleware";

import { verifyCsrfTokenMiddleware } from "../middleware/crf.middleware";
import { authenticateUserMiddleware } from "../middleware/auth.middleware";

const router = express.Router();


router.get("/users/getMytask", normalLimiter, authenticateUserMiddleware,getTaskValidation, getUserTaskController as RequestHandler);

router.post("/users/assignTask", universalLimiter, verifyCsrfTokenMiddleware, authenticateUserMiddleware,createTaskValidation, checkPermission(["create_task"]), createTaskController as RequestHandler);

router.post("/users/updateTaskStatus", normalLimiter, authenticateUserMiddleware,updateTaskStatusValidator, updateTaskStatusController as RequestHandler);

router.get("/users/getAllTeamTasks", normalLimiter, authenticateUserMiddleware, getTeamTasksController as RequestHandler);
router.put("/users/updateTask", normalLimiter, authenticateUserMiddleware,updateTaskValidator,checkPermission(["update_task"]), updateTaskController as RequestHandler);

router.delete("/users/updateTask", normalLimiter, authenticateUserMiddleware,deleteTaskValidator,checkPermission(["delete_task"]), deleteTaskController as RequestHandler);
router.get("/users/getTeamProgress", normalLimiter, authenticateUserMiddleware, getTeamProgressController as RequestHandler);


export default router;