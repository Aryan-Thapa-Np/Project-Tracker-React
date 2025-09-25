import { body, query, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from 'express';

const validationresults = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

const includesUppercase = (str:string) => /[A-Z]/.test(str);
const includesNumber = (str:string) => /[0-9]/.test(str);
const includesSpecialCharacter = (str:string) => /[!@#$%^&*(),.?":{}|<>]/.test(str);


const loginValidation = [

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),

    body("password")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

    body("rememberMe")
        .optional()
        .isBoolean().withMessage("Remember Me must be a boolean."),

    validationresults,
];

const emailVerificationValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),

    body("code")
        .trim()
        .notEmpty().withMessage("Code is required.")
        .isNumeric().withMessage("Code must be a number.")
        .isLength({ min: 4, max: 6 }).withMessage("Code must be exactly 6 digits."),

    body("rememberMe")
        .optional()
        .isBoolean().withMessage("Remember Me must be a boolean."),

    validationresults,
];


const resendEmailVerificationValidation = [

    body("userId")
        .trim()
        .notEmpty().withMessage("userId is required.")
        .isNumeric().withMessage("userId must be a number."),


    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),


    validationresults,
];

const changePasswordvalidation = [
    body("password")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),


    body("confirmPassword")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

    validationresults,
];

const resetChangePasswordValidation = [

    body("token")
        .notEmpty()
        .withMessage("Token is required")
        .isString()
        .withMessage("Token must be a string")
        .isLength({ min: 10, max: 200 })
        .withMessage("Token must be between 10 and 100 characters"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),


    body("NewPassword")
        .notEmpty().withMessage("Password is required.")
        .custom((value) => {
            if (!includesUppercase(value)) {
                throw new Error("Password must include at least one uppercase letter.");
            }
            if (!includesNumber(value)) {
                throw new Error("Password must include at least one number.");
            }
            if (!includesSpecialCharacter(value)) {
                throw new Error("Password must include at least one special character.");
            }
            return true;
        })
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),


    body("ConfirmPassword")
        .notEmpty().withMessage("Password is required.")
        .custom((value) => {
            if (!includesUppercase(value)) {
                throw new Error("Password must include at least one uppercase letter.");
            }
            if (!includesNumber(value)) {
                throw new Error("Password must include at least one number.");
            }
            if (!includesSpecialCharacter(value)) {
                throw new Error("Password must include at least one special character.");
            }
            return true;
        })
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

    validationresults,
];

const resetEmailValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),


    validationresults,
];

const resendEmailVerification2FAValidation = [

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),


    validationresults,
];




const createUserValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required.")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be at least 3-30 characters long."),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format."),

    body("password")
        .notEmpty().withMessage("Password is required.")
        .custom((value) => {
            if (!includesUppercase(value)) {
                throw new Error("Password must include at least one uppercase letter.");
            }
            if (!includesNumber(value)) {
                throw new Error("Password must include at least one number.");
            }
            if (!includesSpecialCharacter(value)) {
                throw new Error("Password must include at least one special character.");
            }
            return true;
        })
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

    body("role")
        .trim()
        .notEmpty().withMessage("role is required."),


    validationresults,
];


const getUsersValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),

    query("status")
        .optional()
        .isIn(["active", "banned", "suspended"]).withMessage("Status must be active, inactive, or suspended."),

    query("role")
        .optional()
        .isIn(["customer", "staff", "admin", "seller"]).withMessage("Role must be a valid user role."),


    query("search")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Search query cannot exceed 50 characters.")


        .customSanitizer((value) => {
            if (!value) return value;

            return value
                .replace(/<[^>]*>/g, '')
                .replace(/[<;',.[{=+-0}]>'"&]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        })

        .matches(/^[a-zA-Z0-9\s\-_.@]*$/)
        .withMessage("Search query contains invalid characters.")


        .custom((value) => {
            if (!value) return true;


            if (/(.)\1{4,}/.test(value)) {
                throw new Error('Too many repeated characters.');
            }

            return true;
        }),

    validationresults,
];


export {

    loginValidation,
    emailVerificationValidation,
    resendEmailVerificationValidation,
    resetChangePasswordValidation,
    changePasswordvalidation,
    resetEmailValidation,
    resendEmailVerification2FAValidation,
    createUserValidation,
    getUsersValidation,

};