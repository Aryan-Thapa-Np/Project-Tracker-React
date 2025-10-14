export const escapeForSQL = (value: string) =>
    value
        .replace(/'/g, "''") // escape single quotes
        .replace(/--/g, "") // remove comment sequence
        .replace(/;/g, "") // remove statement terminator
        .trim();


export const escapeHTML = (value: string) =>
    value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .trim();

export const escapeMinimal = (value: string) =>
    value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();

export const sanitizeInput = (value: string) =>
    value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/'/g, "''") // escape single quotes
        .replace(/--/g, "") // remove comment sequence
        .replace(/;/g, "")
        .trim();