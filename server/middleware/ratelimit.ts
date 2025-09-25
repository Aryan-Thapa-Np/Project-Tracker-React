import rateLimit from "express-rate-limit";


export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const universalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const normalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        error: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});



export const EamilverificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});


export const csrfGetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});


export const resetPasswordLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 2,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const reqresetPasswordLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 4,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});



export const profileUpdateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const LogOutLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});



