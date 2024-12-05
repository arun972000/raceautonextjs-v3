import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const category = pathname.split("/").pop();
    if (category == "0") {
      const [result] = await db.execute("SELECT * FROM newsletter");
      return NextResponse.json(result);
    }

    const [results] = await db.execute(
      `SELECT * FROM newsletter WHERE category = ?`,
      [category]
    );
    return NextResponse.json(results);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: "internal server error" }, { status: 500 });
  }
}
