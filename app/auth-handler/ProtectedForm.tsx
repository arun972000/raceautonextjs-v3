"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
} from "firebase/auth";
import { auth } from "@/firebase";
import axios from "axios";
import { toast } from "react-toastify";

const AuthActionHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!oobCode || !mode) return;

    if (mode === "resetPassword") {
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setEmail(email);
          setIsCodeValid(true);
        })
        .catch(() => {
          toast.error("Invalid or expired reset link.");
          setIsCodeValid(false);
        });
    }

    if (mode === "verifyEmail") {
      applyActionCode(auth, oobCode)
        .then(() => {
          toast.success("Email verified successfully!");
          setIsVerified(true);
        })
        .catch(() => {
          toast.error("Invalid or expired verification link.");
          setIsVerified(false);
        });
    }
  }, [mode, oobCode]);

  const handlePasswordReset = async () => {
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);

      // Update password in backend
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/login/update-password`, {
        email,
        password: newPassword,
      });

      toast.success("Password updated successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  if (!oobCode || !mode) {
    return <h4>Invalid or missing link data</h4>;
  }

  if (mode === "verifyEmail") {
    return (
      <div className="container mt-5">
        <h3>{isVerified ? "Your email has been verified!" : "Verifying email..."}</h3>
        {isVerified && (
          <button className="btn btn-success mt-3" onClick={() => router.push("/login")}>
            Back to Login
          </button>
        )}
      </div>
    );
  }

  if (mode === "resetPassword") {
    if (!isCodeValid) {
      return <h4>Invalid or expired reset link</h4>;
    }

    return (
      <div className="container mt-5">
        <h3>Reset your password</h3>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handlePasswordReset}>
          Reset Password
        </button>
      </div>
    );
  }

  return <h4>Unsupported action type</h4>;
};

export default AuthActionHandler;
