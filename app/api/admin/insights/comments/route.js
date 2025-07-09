import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const BUCKET = process.env.AWS_S3_BUCKET_NAME || "";

// GET: Fetch all thoughts & replies for a given insight_id
export async function GET(req) {
  const insight_id = req.nextUrl.searchParams.get("insight_id");

  if (!insight_id) {
    return NextResponse.json({ error: "Missing insight_id" }, { status: 400 });
  }

  const [results] = await db.execute(
    "SELECT * FROM insight_comments WHERE insight_id = ? ORDER BY created_at ASC",
    [insight_id]
  );

  return NextResponse.json(results);
}

// POST: Add new thought or reply
export async function POST(req) {
  try {
    const formData = await req.formData();
    const insight_id = formData.get("insight_id");
    const user_email = formData.get("user_email");
    const comment = formData.get("comment");
    const image = formData.get("image");
    const parent_id = formData.get("parent_id");

    if (!insight_id || !user_email || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let image_url = null;

    if (image && typeof image === "object" && image.size > 0) {
      const ext = path.extname(image.name);
      const fileName = `uploads/insights/comments/${uuidv4()}${ext}`;
      const buffer = Buffer.from(await image.arrayBuffer());

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: fileName,
          Body: buffer,
          ContentType: image.type,
        })
      );

      image_url = fileName;
    }

    await db.execute(
      "INSERT INTO insight_comments (insight_id, user_email, comment, image_url, parent_id) VALUES (?, ?, ?, ?, ?)",
      [insight_id, user_email, comment, image_url, parent_id || null]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST comment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Edit existing thought/reply
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const comment = formData.get("comment");
    const image = formData.get("image");

    if (!id || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let updateQuery = "UPDATE insight_comments SET comment = ?";
    const updateParams = [comment];

    if (image && typeof image === "object" && image.size > 0) {
      const ext = path.extname(image.name);
      const key = `uploads/insight-comments/${uuidv4()}${ext}`;
      const buffer = Buffer.from(await image.arrayBuffer());

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: image.type,
        })
      );

      updateQuery += ", image_url = ?";
      updateParams.push(key);
    }

    updateQuery += " WHERE id = ?";
    updateParams.push(id);

    await db.execute(updateQuery, updateParams);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT comment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove thought or reply
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });
    }

    // Optionally: also delete replies
    await db.execute("DELETE FROM insight_comments WHERE id = ? OR parent_id = ?", [id, id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE comment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
