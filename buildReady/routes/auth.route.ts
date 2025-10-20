import express from "express";
import type { RequestHandler } from "express";

import {
    emailVerifyController,
    loginController,
    ResetPasswordController,
    reqResetPasswordController,
    ResetSettingPasswordController,
    LogoutController,
    regiii,
    permissionSendController,
    resendEmailController,
    getUserDetailsController
} from "../controllers/auth.controller";
import { getLogsController } from "../controllers/others.controller";
import {
    reqresetPasswordLimiter,
    loginLimiter,
    csrfGetLimiter,
    resetPasswordLimiter,
    normalLimiter,
    universalLimiter,
    EamilverificationLimiter
} from "../middleware/ratelimit";

import { verifyCsrfTokenMiddleware, createCsrfTokenMiddleware } from "../middleware/crf.middleware";
import { authenticateUserMiddleware } from "../middleware/auth.middleware";
import { emailVerificationValidation, logsFiltersValidation, loginValidation, resendEmailVerificationValidation, resetEmailValidation, resetChangePasswordValidation, changePasswordvalidation } from "../middleware/validator";

import {
    checkPermission
} from "../middleware/roleBaseAccess.middleware";



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
router.post("/user/emailResend", EamilverificationLimiter, verifyCsrfTokenMiddleware, resendEmailVerificationValidation, resendEmailController as RequestHandler);
router.get("/database/auth/logs", normalLimiter, logsFiltersValidation, authenticateUserMiddleware, checkPermission(["get_logs"]), getLogsController as RequestHandler);

router.get("/user/checkPerm", normalLimiter, authenticateUserMiddleware, checkPermission(["get_logs"]), permissionSendController as RequestHandler);


router.get("/user/logout", universalLimiter, authenticateUserMiddleware,LogoutController as RequestHandler);



export default router;