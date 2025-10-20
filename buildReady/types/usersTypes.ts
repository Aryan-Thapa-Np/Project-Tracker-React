


export interface User {
    user_id: number;
    username: string;
    profile_pic:string;
    role: string;
    email: string;
    email_verified: boolean;
    status: string;
    created_at: Date;
    pc_token: string;
    password:string;
    token_type: string;
    token_expire: Date;
    otp_code: number;
    otp_code_type: string;
    code_expire: Date;
    attempts: number;
    status_expire:Date;
    notification_count:number;
    isAllowed: boolean;

}
