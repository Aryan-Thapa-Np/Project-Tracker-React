


export interface User {
    user_id: number;
    profile_pic:string;
    username: string;
    role: string;
    email: string;
    email_verified: boolean;
    status: string;
    created_at: Date;
    code_expire: Date;
    attempts: number;
    status_expire: string | null;
    notification_count:number;
    isAllowed:boolean;

}
