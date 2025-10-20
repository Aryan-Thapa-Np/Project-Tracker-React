
import { emailVerifyController,resendEmailController } from './auth/emailVerify.controller';
import { loginController,regiii,LogoutController } from './auth/login.controller';
import { ResetPasswordController, reqResetPasswordController, ResetSettingPasswordController } from './auth/resetPassword.controller';
import {getUserDetailsController} from "./auth/userDetails.controller";
import {permissionSendController} from "./auth/permission.controller";


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