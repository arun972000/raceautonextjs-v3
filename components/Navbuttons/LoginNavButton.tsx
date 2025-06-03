"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProfileButton from "./ProfileButton";
import { CiLogin } from "react-icons/ci";
import AuthModal from "@/app/test/components/LoginFormTest";

const LoginNavButton = () => {
  const [token, setToken] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const cookieToken: any = Cookies.get("authToken");
    setToken(cookieToken);
  }, []);

  if (!token) {
    return (
      <>
        <CiLogin
          onClick={() => setShowAuth(true)}
          size={25}
          style={{ cursor: "pointer" }}
          className="ms-auto"
        />
        <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return <ProfileButton token={token} />;
};

export default LoginNavButton;
