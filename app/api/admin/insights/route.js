// /app/api/insights/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db"; // your DB utility with connection logic
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        insights.id, 
        insights.title,
        GROUP_CONCAT(insight_images.image_url) AS images
      FROM insights
      LEFT JOIN insight_images ON insight_images.insight_id = insights.id
      GROUP BY insights.id
      ORDER BY insights.id DESC
    `);

    // Convert comma-separated images to array
    const insights = rows.map((row) => ({
      ...row,
      images: row.images ? row.images.split(",") : [],
    }));

    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const quotes = formData.get("quotes");
    const notes = formData.get("notes");
    const chartsJson = formData.get("charts"); // should be a stringified JSON array
    const images = formData.getAll("images"); // multiple image File objects

    if (!title || !content || !chartsJson) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const charts = JSON.parse(chartsJson);

    const [insightResult] = await db.execute(
      `INSERT INTO insights (title, content, quotes, notes) VALUES (?, ?, ?, ?)`,
      [title, content, quotes, notes]
    );
    const insightId = insightResult.insertId;

    for (let i = 0; i < charts.length; i++) {
      const { type, data, heading } = charts[i];
      await db.execute(
        `INSERT INTO insight_charts (insight_id, chart_type, chart_index, heading, data) VALUES (?, ?, ?, ?, ?)`,
        [insightId, type, i, heading || null, JSON.stringify(data)]
      );
    }

    // Upload images to S3
    for (const file of images) {
      if (file && typeof file === "object" && file.size > 0) {
        const fileExt = path.extname(file.name);
        const fileName = `${uuidv4()}${fileExt}`;
        const s3Key = `uploads/insights/${fileName}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Save image reference in DB
        await db.execute(
          `INSERT INTO insight_images (insight_id, image_url) VALUES (?, ?)`,
          [insightId, s3Key]
        );
      }
    }

    return NextResponse.json({ success: true, insightId });
  } catch (error) {
    console.error("Insight POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}