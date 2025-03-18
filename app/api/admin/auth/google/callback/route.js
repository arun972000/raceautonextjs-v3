import db from "@/lib/db";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri:
            "http://localhost:3000/api/admin/auth/google/callback",
        },
      }
    );

    const { access_token } = data;

    // Get user info from Google
    const { data: userInfo } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userInfo || !userInfo.email) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check if the user exists
    const [result] = await db.execute("SELECT * FROM users WHERE email = ?", [
      userInfo.email,
    ]);

    let token;
    if (result.length === 0) {
      // New user: Insert into DB
      await db.execute(
        "INSERT INTO users (username, slug, email, google_id) VALUES (?, ?, ?, ?)",
        [
          userInfo.name,
          userInfo.name.toLowerCase().split(" ").join("-"),
          userInfo.email,
          userInfo.sub,
        ]
      );

      const [newUser] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [userInfo.email]
      );

      // Generate JWT token for the new user
      token = jwt.sign(
        {
          id: newUser[0].id,
          email: newUser[0].email,
          role: newUser[0].role,
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
      );
    } else {
      // Existing user: Generate JWT token
      token = jwt.sign(
        {
          id: result[0].id,
          email: result[0].email,
          role: result[0].role,
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
      );
    }

    // Create a redirect URL with a timestamp query parameter to force a full reload.
    const redirectUrl = new URL(`/?verified=true`, req.url);

    const response = NextResponse.redirect(redirectUrl);

    // Set cache control headers to ensure a fresh reload
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    response.cookies.set("authToken", token, {
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error authenticating:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
