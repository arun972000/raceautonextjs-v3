"use client";
import React, { useState } from "react";
import AuthModal from "./components/LoginFormTest";
import { Button } from "react-bootstrap";

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Button onClick={() => setShowAuth(true)}>Open Auth</Button>
      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
