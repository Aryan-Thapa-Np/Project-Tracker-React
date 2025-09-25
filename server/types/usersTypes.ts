


export interface User {
    user_id: number;
    username: string;
    password: string;
    role: string;
    email: string;
    email_verified: boolean;
    status: string;
    created_at: Date;
    pc_token: string;
    token_type: string;
    token_expire: Date;
    otp_code: number;
    otp_code_type: string;
    code_expire: Date;
    attempts: number;
    status_expire:Date;
}
