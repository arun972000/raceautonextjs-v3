import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import s3Client from "@/lib/s3Client";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get("post_id");

    if (!post_id) {
      return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    }

    const [rows] = await db.execute(
      "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC",
      [post_id]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET comments error:", err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const { id, comment } = await req.json();

    if (!id || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.execute(`UPDATE comments SET comment = ? WHERE id = ?`, [comment, id]);

    return NextResponse.json({ success: true, message: "Comment updated" });
  } catch (error) {
    console.error("Update failed", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const post_id = formData.get("post_id");
    const comment = formData.get("comment")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const file = formData.get("image");

    if (!email || !comment || !post_id) {
      return NextResponse.json({ error: "Email, comment and post_id are required" }, { status: 400 });
    }

    let image_url = null;

    // Upload image to S3 if present
    if (file && file.size > 0) {
      const fileExt = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExt}`;
      const s3Key = `uploads/comments/${fileName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      image_url = s3Key; // or use full URL if you want: `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`
    }

    // Insert into DB
    await db.execute(
      "INSERT INTO comments (post_id, email, comment, image_url) VALUES (?, ?, ?, ?)",
      [post_id, email, comment, image_url]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST comment error:", err);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
