export const escapeForSQL = (value: string) =>
    value
        .replace(/'/g, "''") // escape single quotes
        .replace(/--/g, "") // remove comment sequence
        .replace(/;/g, "") // remove statement terminator
        .trim();


export const escapeHTML = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#x2F;")
        .trim();

export const sanitizeInput = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#x2F;")
        .replace(/'/g, "''") // escape single quotes
        .replace(/--/g, "") // remove comment sequence
        .replace(/;/g, "")
        .trim();