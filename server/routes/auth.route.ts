import express from "express";
import type {RequestHandler} from "express";

import {
    emailVerifyController,
    loginController,
    ResetPasswordController,
    reqResetPasswordController,
    ResetSettingPasswordController,
    regiii
} from "../controllers/auth.controller.ts";
import { verifyCsrfTokenMiddleware, createCsrfTokenMiddleware } from "../middleware/crf.middleware.ts";
import { authenticateUserMiddleware } from "../middleware/auth.middleware.ts";
import {emailVerificationValidation,loginValidation,resetEmailValidation,resetChangePasswordValidation,changePasswordvalidation} from "../middleware/validator.ts";

const router = express.Router();


router.get("/get/csrf", createCsrfTokenMiddleware as RequestHandler);


router.post("/user/login",loginValidation, loginController as RequestHandler);

router.post("/user/regi", regiii as RequestHandler);

router.post("/user/reqResetPassword",resetEmailValidation, reqResetPasswordController as RequestHandler);


router.post("/user/resetPassword",resetChangePasswordValidation, ResetPasswordController as RequestHandler);


router.post(
    "/user/ResetSettingPassword",
    changePasswordvalidation,
    authenticateUserMiddleware,
    verifyCsrfTokenMiddleware,
    ResetSettingPasswordController
);


router.post("/user/verifyEmail",emailVerificationValidation, emailVerifyController as RequestHandler);


export default router;