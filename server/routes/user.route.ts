import express from "express";
import type { RequestHandler } from "express";

import {
    getUsersController,
    createUserController,
    updateUserSelfController,
    getUsersNamesController,
    updateUserController
} from "../controllers/user.controller.ts";

import {
    getNotificationsController,
    markAsReadController,
    markAllAsReadController,
    deleteNotificationController,
    getNotificationCountController
} from "../controllers/others.controller.ts";
import {
    createUserValidation,
    getUsersValidation,
    updateUsersValidation,
    updateUserSelfValidation,
    getNotificationsValidator,
    markAsReadValidator,
    deleteNotificationValidator
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

router.post("/users/updateUsers", verifyCsrfTokenMiddleware, authenticateUserMiddleware, updateUserSelfValidation, upload.single("profile_pic"), updateUserSelfController as RequestHandler);

router.post("/users/updateusersData", verifyCsrfTokenMiddleware, authenticateUserMiddleware, updateUsersValidation, updateUserController as RequestHandler);


router.get("/users/userNames", normalLimiter, authenticateUserMiddleware, getUsersNamesController as RequestHandler);



router.get("/users/getnotifications", normalLimiter, getNotificationsValidator, authenticateUserMiddleware, getNotificationsController as RequestHandler)
router.patch("/users/markasread/:id", normalLimiter,verifyCsrfTokenMiddleware, markAsReadValidator, authenticateUserMiddleware, markAsReadController as RequestHandler)
router.patch("/users/markallasread", normalLimiter,verifyCsrfTokenMiddleware, authenticateUserMiddleware, markAllAsReadController as RequestHandler)
router.delete("/users/deletenotification/:id", normalLimiter,verifyCsrfTokenMiddleware, deleteNotificationValidator, authenticateUserMiddleware, deleteNotificationController as RequestHandler)

router.get("/users/getnotificationsCount", normalLimiter, authenticateUserMiddleware, getNotificationCountController as RequestHandler)



export default router;