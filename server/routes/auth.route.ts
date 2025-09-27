import express from "express";
import type { RequestHandler } from "express";

import {
    emailVerifyController,
    loginController,
    ResetPasswordController,
    reqResetPasswordController,
    ResetSettingPasswordController,
    regiii,
    getUserDetailsController
} from "../controllers/auth.controller.ts";

import {
    reqresetPasswordLimiter,
    loginLimiter,
    csrfGetLimiter,
    resetPasswordLimiter,
    EamilverificationLimiter
} from "../middleware/ratelimit.ts";

import { verifyCsrfTokenMiddleware, createCsrfTokenMiddleware } from "../middleware/crf.middleware.ts";
import { authenticateUserMiddleware } from "../middleware/auth.middleware.ts";
import { emailVerificationValidation, loginValidation, resetEmailValidation, resetChangePasswordValidation, changePasswordvalidation } from "../middleware/validator.ts";

const router = express.Router();


router.get("/user/getCsrf", csrfGetLimiter, createCsrfTokenMiddleware as RequestHandler);
router.get("/user/auth/check", csrfGetLimiter, authenticateUserMiddleware, getUserDetailsController as RequestHandler);


router.post("/user/login", loginLimiter, verifyCsrfTokenMiddleware, loginValidation, loginController as RequestHandler);

// router.post("/user/regi", regiii as RequestHandler);

router.post("/user/reqResetPassword", reqresetPasswordLimiter, verifyCsrfTokenMiddleware, resetEmailValidation, reqResetPasswordController as RequestHandler);


router.post("/user/resetPassword", resetPasswordLimiter, verifyCsrfTokenMiddleware, resetChangePasswordValidation, ResetPasswordController as RequestHandler);


router.post(
    "/user/ResetSettingPassword",
    resetPasswordLimiter,
    verifyCsrfTokenMiddleware,
    changePasswordvalidation,
    authenticateUserMiddleware,
    verifyCsrfTokenMiddleware,
    ResetSettingPasswordController
);


router.post("/user/verifyEmail", EamilverificationLimiter, verifyCsrfTokenMiddleware, emailVerificationValidation, emailVerifyController as RequestHandler);


export default router;