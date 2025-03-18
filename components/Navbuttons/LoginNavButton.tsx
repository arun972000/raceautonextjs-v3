"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProfileButton from "./ProfileButton";
import { CiLogin } from "react-icons/ci";
import Link from "next/link";

const LoginNavButton = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookieToken:any = Cookies.get("authToken");
    setToken(cookieToken);
  }, []);

  if (!token) {
    return (
      <Link href="/login">
        <CiLogin size={25} className="me-3" />
      </Link>
    );
  }

  return <ProfileButton token={token} />;
};

export default LoginNavButton;
