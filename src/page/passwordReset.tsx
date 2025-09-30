import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";
import { escapeHTML, escapeForSQL } from "../sub-components/sanitize.tsx";
import { getCsrfToken } from "../sub-components/csrfToken.tsx";
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"email" | "reset">("email"); // step control
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);


  // --- Helpers ---
  const sanitizeEmail = (val: string) => escapeHTML(escapeForSQL(val.trim().toLowerCase()));
  const sanitizePassword = (val: string) => escapeHTML(escapeForSQL(val.trim()));

  const handleCodeChange = (val: string, index: number) => {
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      if (val && index < 5) {
        const nextInput = document.getElementById(`reset-code-${index + 1}`);
        (nextInput as HTMLInputElement | null)?.focus();
      }
    }
  };

  // --- Step 1: Send code ---
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/user/reqResetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": await getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify({ email: sanitizeEmail(email) }),
      });

      const data = await res.json();
      let msg: string;
      if (!res.ok && data.success === false) {

        msg = data.error;
        return toast.error(msg);
      }

      msg = data.message;

      toast.success(msg || "Verification code sent!");
      setPhase("reset");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Reset password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/user/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": await getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify({
          email: sanitizeEmail(email),
          code: escapeHTML(escapeForSQL(code.join(""))),
          newPassword: sanitizePassword(newPassword),
        }),
      });

      const data = await res.json();
      let msg: string;

      if (!res.ok && data.success === false) {
        if (Array.isArray(data.errors)) {
          msg = data.errors[0].msg || "Validation failed";
          return toast.error(msg);
        }

        if (data.error) {
          msg = data.error;
          return toast.error(msg);
        }

        return toast.error("Unknown error occurred");
      }

      msg = data.message;

      toast.success(msg || "Password reset successful!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };


  // Password focus handlers (show/hide toggle)
  const onPasswordFocus = () => setIsPasswordFocused(true);
  const onPasswordBlur = () => {
    setIsPasswordFocused(false);
    setIsPasswordVisible(false); // hide password when blur for security
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={phase === "email" ? handleRequestCode : handleResetPassword}
        className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          {phase === "email" ? "Reset Password" : "Set New Password"}
        </h2>

        {/* Phase 1: Enter email */}
        {phase === "email" && (
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-2"
            />
          </div>
        )}

        {/* Phase 2: Enter code + new password */}
        {phase === "reset" && (
          <>
            <div>
              <Label>6-Digit Code</Label>
              <div className="flex justify-center space-x-3 mt-2">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`reset-code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, idx)}
                    className="w-12 h-12 border rounded text-center text-xl focus:ring-2 focus:ring-gray-300"
                  />
                ))}
              </div>
            </div>

            <div className="relative ">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={isPasswordVisible ? "text" : "password"}
                onFocus={onPasswordFocus}
                onBlur={onPasswordBlur}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-2"
              />

              {/* Toggle icon: visible only while focused */}
              {isPasswordFocused && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setIsPasswordVisible((s) => !s)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  className="absolute right-3 top-10 -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer"
                  title={isPasswordVisible ? "Hide password" : "Show password"}
                >

                  {isPasswordVisible ? (
                    // Eye Open (visible)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    // Eye Closed (hidden)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a11.04 11.04 0 012.223-3.998M6.18 6.18A9.969 9.969 0 0112 5c4.478 0 8.268 2.943 9.542 7-0.463 1.473-1.233 2.804-2.23 3.948M3 3l18 18" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </>
        )}

        <div className="text-right">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Remember password?
          </Link>
        </div>

        <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Sentry size={15} color="#fff" /> {phase === "email" ? "Sending..." : "Resetting..."}
            </>
          ) : phase === "email" ? (
            "Send Code"
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}
