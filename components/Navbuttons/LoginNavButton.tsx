"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProfileButton from "./ProfileButton";
import { CiLogin } from "react-icons/ci";
import AuthModal from "@/app/test/components/LoginFormTest";

const LoginNavButton = () => {
  const [token, setToken] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cookieToken = Cookies.get("authToken");
    setToken(cookieToken || null);
    setShowAuth(true); // ✅ Set to true only after mount to avoid hydration mismatch
  }, []);

  if (!mounted) return null;

  if (!token) {
    return (
      <>
        <CiLogin
          onClick={() => setShowAuth(true)}
          size={25}
          style={{ cursor: "pointer" }}
          className="ms-auto"
        />
        {showAuth && (
          <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
        )}
      </>
    );
  }

  return <ProfileButton token={token} />;
};

export default LoginNavButton;
