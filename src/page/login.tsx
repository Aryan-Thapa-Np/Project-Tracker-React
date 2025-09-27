import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { escapeHTML, escapeForSQL } from "../sub-components/sanitize.tsx";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_URL;





export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [passwordRaw, setPasswordRaw] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);


  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // ---------- Sanitization / escaping helpers ----------
  // Trim & normalize email
  const sanitizeEmailInput = (value: string) => value.trim().toLowerCase();

  // Trim password for leading/trailing whitespace
  const sanitizePasswordInput = (value: string) => value.trim();



  // ---------- Handlers ----------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Raw -> sanitized versions
    const cleanEmail = sanitizeEmailInput(email);
    const cleanPassword = sanitizePasswordInput(passwordRaw);

    // Basic client-side validation
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      alert("Please enter a valid email.");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }


    const emailForSql = escapeForSQL(cleanEmail);
    const passwordForSql = escapeForSQL(cleanPassword);

    const finalEmail = escapeHTML(emailForSql);
    const finalPassword = escapeHTML(passwordForSql);



    try {
      const res = await fetch(`${apiUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        },
        body: JSON.stringify({
          email: finalEmail,
          password: finalPassword,
          rememberMe: true
        })
      });
      let msg: string;
      const data = await res.json();

      if (!res.ok && data.success === false) {
        console.log(data);
        msg = data.error;
        return toast.error(msg);
      }
      if (data.isEmailVerified === false) {
        toast.info("Email verification Required.");
        return setShowCodeModal(true);
      }
      msg = data.message;
      toast.success(msg);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (error) {

      console.log(error);
    }

  };

  // Keep code digits numeric only
  const handleCodeChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        (nextInput as HTMLInputElement | null)?.focus();
      }
    }
  };

  const handleVerifyCode = () => {
    const finalCode = code.join("");
    console.log("Entered Code:", finalCode);
    // TODO: Verify code with backend
    setShowCodeModal(false);
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
        onSubmit={handleLogin}
        className="w-full max-w-3xl bg-white p-12 rounded-lg shadow-2xl space-y-6"
      >
        <h2 className="text-4xl font-bold text-center">Login</h2>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}

            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-lg mt-2  py-1 rounded-md"
          />

        </div>

        <div>
          <Label htmlFor="password">Password</Label>


          <div className="relative mt-2">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={passwordRaw}
              onChange={(e) => setPasswordRaw(e.target.value)}
              onFocus={onPasswordFocus}
              onBlur={onPasswordBlur}
              placeholder="••••••••"
              required
              className="w-full border rounded-md px-4 py-1 text-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            // optionally prevent pasting to reduce accidental paste (commented)
            // onPaste={(e) => e.preventDefault()}
            />

            {/* Toggle icon: visible only while focused */}
            {isPasswordFocused && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsPasswordVisible((s) => !s)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer"
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
          <p className="text-sm text-muted-foreground mt-1">
            Don't share your password.
          </p>
        </div>

        <div className="text-right">
          <a href="/forgotPassword" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full py-3 text-lg cursor-pointer">
          Login
        </Button>
      </form>

      {/* 6-digit code modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter 6-Digit Code</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center space-x-3 mt-4">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(e.target.value, index)}
                className="w-14 h-14 border rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button onClick={handleVerifyCode} className="py-2 px-6 text-lg">
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
