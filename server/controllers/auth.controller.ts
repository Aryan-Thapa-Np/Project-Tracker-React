
import { emailVerifyController,resendEmailController } from './auth/emailVerify.controller.ts';
import { loginController,regiii,LogoutController } from './auth/login.controller.ts';
import { ResetPasswordController, reqResetPasswordController, ResetSettingPasswordController } from './auth/resetPassword.controller.ts';
import {getUserDetailsController} from "./auth/userDetails.controller.ts";
import {permissionSendController} from "./auth/permission.controller.ts";


export {
    emailVerifyController,
    resendEmailController,
    loginController,
    ResetPasswordController,
    reqResetPasswordController,
    ResetSettingPasswordController,
    getUserDetailsController,
    permissionSendController,
    LogoutController,
    regiii
}