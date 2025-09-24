import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Define environment variables as strings
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const WEBSITE = process.env.WEBSITE;


const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify((error: Error | null) => {
    if (error) {
        console.error("Mail server connection error:", error);
    } else {
        console.log("Mail server is ready to send messages");
    }
});


// TypeScript type for sendMail function
export const sendMail = async (
    to: string,
    subject: string,
    html: string
)=> {
    try {
        const info = await transporter.sendMail({
            from: `"${WEBSITE}" <${EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// Email verification service
export const emailVerificationService = async (
    to: string,
    code: string
): Promise<void> => {
    const verifyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ddd; text-align: center;">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="color: #555;">Use the code below to verify your email. This code will expire in 2 minutes.</p>
        <div style="display: inline-block; background: #e7edf4; color: #0d141c; font-size: 24px; letter-spacing: 6px; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
            ${code}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">If you didn’t request this code, please ignore this email.</p>
    </div>
    `;
    await sendMail(to, "Email Verification", verifyHtml);
};





export const passwordChangeReqService = async (
    to: string,
    code: string
): Promise<void> => {
    const verifyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ddd; text-align: center;">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="color: #555;">Use the code below to reset your password. This code will expire in 2 minutes.</p>
        <div style="display: inline-block; background: #e7edf4; color: #0d141c; font-size: 24px; letter-spacing: 6px; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
            ${code}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">If you didn’t request this code, please ignore this email.</p>
    </div>
    `;
    await sendMail(to, "Email Verification", verifyHtml);
};


// // Password change request service
// export const passwordChangeReq = async (
//     to: string,
//     token: string
// ): Promise<void> => {
//     const passwordChangeHtml = `
//     <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ddd; text-align: center;">
//         <h2 style="color: #333;">Password Change</h2>
//         <p style="color: #555;">Click below to reset your password. This token will expire in 2 minutes.</p>
//         <div style="display: inline-block; background: #e7edf4; color: #0d141c; font-size: 14px; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
//             <a href="http://localhost:4000/resetchangepassword?token=${token}&email=${encodeURIComponent(to)}">Click Here</a>
//         </div>
//         <p style="color: #888; font-size: 12px; margin-top: 20px;">If you didn’t request this token, please ignore this email.</p>
//     </div>
//     `;
//     await sendMail(to, "Password Change", passwordChangeHtml);
// };
