import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Check if email already exists
    const [existingEmail] = await db.execute(
      "SELECT * FROM subscribers WHERE email = ?",
      [payload.email]
    );

    if (Array.isArray(existingEmail) && existingEmail.length > 0) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Insert new subscriber
    await db.execute(
      "INSERT INTO subscribers (name, email, phone_number) VALUES (?, ?, ?)",
      [payload.name, payload.email, payload.phone]
    );

    return NextResponse.json({ message: "Subscriber added" }, { status: 200 });

  } catch (err) {
    console.error("Error adding subscriber:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
      const [rows] = await db.execute("SELECT * FROM subscribers ORDER BY id DESC");
      return NextResponse.json(rows, { status: 200 });
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }