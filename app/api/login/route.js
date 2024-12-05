import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if the user exists
    const [verifyEmail] = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (verifyEmail.length === 0) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    const user = verifyEmail[0];

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        id: verifyEmail[0].id,
        email: verifyEmail[0].email,
        role: verifyEmail[0].role,
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    // Encrypt the token using CryptoJS

    // Set the encrypted token as a cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("authToken", token, {
      path: "/",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
