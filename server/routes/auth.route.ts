import express from "express";
import type {RequestHandler} from "express";

import {
    emailVerify,
    loginController,
    ResetPasswordController,
    reqResetPasswordController,
    ResetSettingPasswordController,
    regiii
} from "../controllers/auth.controller.ts";
import { verifyCsrfTokenMiddleware, createCsrfTokenMiddleware } from "../middleware/crf.middleware.ts";
import { authenticateUserMiddleware } from "../middleware/auth.middleware.ts";


const router = express.Router();


router.get("/get/csrf", createCsrfTokenMiddleware as RequestHandler);


router.post("/user/login", loginController as RequestHandler);
router.post("/user/regi", regiii as RequestHandler);

router.post("/user/reqResetPassword", verifyCsrfTokenMiddleware, reqResetPasswordController as RequestHandler);


router.post("/user/resetPassword", verifyCsrfTokenMiddleware, ResetPasswordController as RequestHandler);


router.post(
    "/user/ResetSettingPassword",
    authenticateUserMiddleware,
    verifyCsrfTokenMiddleware,
    ResetSettingPasswordController
);


router.post("/user/verifyEmail", verifyCsrfTokenMiddleware, emailVerify as RequestHandler);


export default router;