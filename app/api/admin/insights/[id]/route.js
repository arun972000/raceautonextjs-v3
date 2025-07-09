import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid";
import path from "path";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";



export async function GET(req, { params }) {
  const id = params.id;

  try {
    const [insightRows] = await db.execute(`SELECT * FROM insights WHERE id = ?`, [id]);
    if (insightRows.length === 0) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    const insight = insightRows[0];

    const [chartRows] = await db.execute(
      `SELECT * FROM insight_charts WHERE insight_id = ? ORDER BY chart_index ASC`,
      [id]
    );

    const charts = chartRows.map((row) => {
      let parsedData;
      try {
        parsedData = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      } catch {
        parsedData = [];
      }
      return {
        type: row.chart_type,
        heading: row.heading,
        data: parsedData
      };
    });

    const [imageRows] = await db.execute(
      `SELECT image_url FROM insight_images WHERE insight_id = ?`,
      [id]
    );
    const images = imageRows.map((img) => img.image_url);

    return NextResponse.json({
      id: insight.id,
      title: insight.title,
      content: insight.content,
      quotes: insight.quotes,
      notes: insight.notes,
      charts,
      images
    });
  } catch (err) {
    console.error("Error fetching insight:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const quotes = formData.get("quotes");
    const notes = formData.get("notes");
    const charts = JSON.parse(formData.get("charts") || "[]");

    const deleteImages = formData.getAll("delete_images"); // s3 keys
    const newImages = formData.getAll("new_images"); // File objects

 

    // Update main insight
    await db.execute(
      `UPDATE insights SET title = ?, content = ?, quotes = ?, notes = ? WHERE id = ?`,
      [title, content, quotes, notes, id]
    );

    // Update charts
    await db.execute(`DELETE FROM insight_charts WHERE insight_id = ?`, [id]);
    for (let i = 0; i < charts.length; i++) {
      const { type, data, heading } = charts[i];
      await db.execute(
        `INSERT INTO insight_charts (insight_id, chart_type, chart_index, heading, data) VALUES (?, ?, ?, ?, ?)`,
        [id, type, i, heading || null, JSON.stringify(data)]
      );
    }

    // Delete image records from DB (not S3)
    for (const s3Key of deleteImages) {
      await db.execute(`DELETE FROM insight_images WHERE insight_id = ? AND image_url = ?`, [id, s3Key]);
    }

    // Upload new images
    for (const file of newImages) {
      if (typeof file === 'object' && file?.name) {
        const fileExt = path.extname(file.name);
        const fileName = `${uuidv4()}${fileExt}`;
        const s3Key = `uploads/insights/${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type
        }));

        // Store in DB
        await db.execute(
          `INSERT INTO insight_images (insight_id, image_url) VALUES (?, ?)`,
          [id, s3Key]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Insight update failed:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  const insightId = parseInt(params.id, 10);

  if (isNaN(insightId)) {
    return NextResponse.json({ success: false, error: 'Invalid insight ID' }, { status: 400 });
  }

  try {
    // Get image keys to optionally delete from S3
    const [imageRows] = await db.execute(
      'SELECT image_url FROM insight_images WHERE insight_id = ?',
      [insightId]
    );

    const imageKeys = (imageRows).map((row) => row.image_url);

    // Delete from related tables first
    await db.execute('DELETE FROM insight_charts WHERE insight_id = ?', [insightId]);
    await db.execute('DELETE FROM insight_images WHERE insight_id = ?', [insightId]);
    await db.execute('DELETE FROM insight_comments WHERE insight_id = ?', [insightId]);

    // Delete main insight
    const [result] = await db.execute('DELETE FROM insights WHERE id = ?', [insightId]);


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE insight error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
