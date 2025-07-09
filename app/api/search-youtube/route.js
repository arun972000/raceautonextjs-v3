import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let youtubeVideos = [];

    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        console.warn("Missing YOUTUBE_API_KEY; skipping YouTube search.");
        throw new Error("Missing API key");
      }

      const ytParams = new URLSearchParams({
        part: "snippet",
        q: query,
        type: "video",
        maxResults: "5",
        key: apiKey,
      });

      const ytUrl = `https://www.googleapis.com/youtube/v3/search?${ytParams.toString()}`;
      const ytRes = await fetch(ytUrl);

      if (!ytRes.ok) {
        console.error("YouTube API error:", await ytRes.text());
        throw new Error("YouTube API request failed");
      }

      const ytData = await ytRes.json();
      youtubeVideos = (ytData.items || []).map((item) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails?.medium?.url,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
      }));
    } catch (err) {
      console.warn("YouTube search failed:", err.message);
      // Proceed with empty youtubeVideos
    }

    // ============= Posts Search =============
    let postResults = [];
    try {
      const [posts] = await db.execute(
        `SELECT id, title, image_mid FROM posts WHERE title LIKE ? LIMIT 5`,
        [`%${query}%`]
      );

      postResults = posts.map((post) => ({
        id: post.id,
        title: post.title,
        image: post.image_mid,
      }));
    } catch (err) {
      console.error("DB query error:", err);
      postResults = [];
    }

    // ============= Return Both Results =============
    return NextResponse.json({
      youtubeVideos,
      postResults,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
