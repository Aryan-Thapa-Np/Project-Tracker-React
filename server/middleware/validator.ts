import { body, query, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from 'express';

const validationresults = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

const includesUppercase = (str: string) => /[A-Z]/.test(str);
const includesNumber = (str: string) => /[0-9]/.test(str);
const includesSpecialCharacter = (str: string) => /[!@#$%^&*(),.?":{}|<>]/.test(str);


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







const createTaskValidation = [
    body("project_id")
        .notEmpty().withMessage("project_id is required.")
        .isInt({ gt: 0 }).withMessage("project_id must be a positive integer."),

    body("milestone_id")
        .optional()
        .isInt({ gt: 0 }).withMessage("milestone_id must be a positive integer if provided."),

    body("assigned_to")
        .notEmpty().withMessage("assigned_to is required.")
        .isInt({ gt: 0 }).withMessage("assigned_to must be a positive integer."),

    body("task_name")
        .notEmpty().withMessage("task_name is required.")
        .isLength({ min: 3 }).withMessage("task_name must be at least 3 characters long."),

    body("status")
        .notEmpty().withMessage("status is required.")
        .isIn(["pending", "in_progress", "completed"]).withMessage("status must be pending, in_progress, or completed."),

    body("due_date")
        .optional()
        .isISO8601().withMessage("due_date must be a valid date."),

    validationresults
];


const getTaskValidation = [
    query("project_id")
        .isEmpty().withMessage("Project id required.")
        .isInt({ gt: 0 }).withMessage("project_id must be a positive integer."),

    query("status")
        .optional()
        .isIn(['todo', 'in_progress', 'completed']).withMessage("status must be pending, in_progress, or completed."),

    validationresults
];

const getProjectsValidation = [
    query("status")
        .optional()
        .isIn(["on_track", "completed", "pending"])
        .withMessage("Invalid project status."),

    query("date")
        .optional()
        .isISO8601()
        .withMessage("Date must be a valid ISO 8601 date."),

    validationresults
];
const createProjectValidation = [
    body("project_name")
        .trim()
        .notEmpty().withMessage("Project name is required.")
        .isLength({ min: 3 }).withMessage("Project name must be at least 3 characters."),

    body("status")
        .optional()
        .isIn(["on_track", "completed", "pending"]).withMessage("Invalid project status."),

    body("due_date")
        .optional()
        .isISO8601().withMessage("due_date must be a valid date."),

    body("milestones")
        .optional()
        .isArray().withMessage("Milestones must be an array."),

    body("milestones.*.milestone_name")
        .notEmpty().withMessage("Milestone name is required.")
        .isLength({ min: 3 }).withMessage("Milestone name must be at least 3 characters."),

    body("milestones.*.completed")
        .optional()
        .isBoolean().withMessage("Milestone completed must be a boolean."),

    body("milestones.*.due_date")
        .optional()
        .isISO8601().withMessage("Milestone due_date must be a valid date."),

    validationresults
];



const getTeamTasksValidation = [
    query("project_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("project_id must be a positive integer."),

    query("status")
        .optional()
        .isIn(["pending", "in_progress", "completed"])
        .withMessage("Invalid status. Allowed: pending, in_progress, completed."),

    query("assigned_to")
        .optional()
        .isInt({ min: 1 })
        .withMessage("assigned_to must be a positive integer."),

    query("due_date")
        .optional()
        .isISO8601()
        .withMessage("due_date must be a valid date in YYYY-MM-DD format."),

    validationresults
];


const createUserValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    body("role")
        .optional()
        .isIn(["admin", "project_manager", "team_member"])
        .withMessage("Invalid role"),

    validationresults
];


const getUsersValidation = [
    query("search").optional().isString().withMessage("Search must be a string"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
    query("role").optional().isIn(["admin", "project_manager", "team_member"]).withMessage("Invalid role"),
    validationresults
];

const updateUsersValidation = [
    body("user_id").notEmpty().withMessage("user_id is required").isInt({ min: 1 }).withMessage("Invalid user_id"),
    body("email_verified").optional().isBoolean().withMessage("email_verified must be a boolean"),
    body("attempts").optional().isInt({ min: 0 }).withMessage("attempts must be a positive integer"),
    body("status").optional().isIn(["active", "locked", "inactive", "banned"]).withMessage("Invalid status"),
    body("status_expire").optional().isISO8601().withMessage("status_expire must be a valid date"),
    body("role").optional().isIn(["admin", "project_manager", "team_member"]).withMessage("Invalid role"),
    validationresults
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
    createTaskValidation,
    getTaskValidation,
    createProjectValidation,
    getProjectsValidation,
    getTeamTasksValidation,
    updateUsersValidation
};