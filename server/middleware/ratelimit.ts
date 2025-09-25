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


export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many Registration attempts. Please try again after 15 minutes."
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


export const csrfGet = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});


export const twoFaEnable = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const twoFaDisable = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const googleOauth = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});


export const resetPassword = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 2,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});


export const profileUpdate = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});

export const LogOut = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});


export const sessionRevoke = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        error: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable X-RateLimit-* headers
});



