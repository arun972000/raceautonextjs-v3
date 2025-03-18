"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PostContent = ({ content, token, is_recommended }: { content: string; token: any; is_recommended:any }) => {
  const router = useRouter();

  const handleCopy = (event: ClipboardEvent) => {
    event.preventDefault();
    const customText = "For more details on this content, visit the Race Auto India website.";
    if (event.clipboardData) {
      event.clipboardData.setData("text", customText);
    }
  };

  const decoded: any = token ? jwtDecode(token) : null;

  useEffect(() => {
    document.addEventListener("copy", handleCopy);
    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  // **Conditionally slicing content**
  const shouldLimitContent = !decoded && is_recommended == 1;

  return (
    <>
      <div
        style={{
          userSelect: "text",
          position: "relative",
          maxHeight: shouldLimitContent ? "200px" : "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{ opacity: shouldLimitContent ? 0.7 : 1 }}
          dangerouslySetInnerHTML={{
            __html: shouldLimitContent ? content.slice(0, 1000) + "..." : content,
          }}
        ></div>
      </div>
      {shouldLimitContent && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "5px",
          }}
        >
          <h3
            style={{
              color: "#333",
              fontSize: "1.5rem",
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            Please Log In to Access the Full Article
          </h3>
          <button
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              fontSize: "1rem",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e: any) => (e.target.style.background = "#0056b3")}
            onMouseOut={(e: any) => (e.target.style.background = "#007bff")}
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      )}
    </>
  );
};

export default PostContent;