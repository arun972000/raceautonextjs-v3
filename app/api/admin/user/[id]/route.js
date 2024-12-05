import db from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const currentDate = new Date();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const year = String(currentDate.getFullYear());
const folderName = `${year}${month}`;

export async function GET(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop();
  try {
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length == 0) {
      return NextResponse.json({ err: "user not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: "internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop();
  const formData = await req.formData();
  const avatar = formData.get("avatar");
  const email = formData.get("email");
  const username = formData.get("username");
  const slug = formData.get("slug");
  const role = formData.get("role");
  const about_me = formData.get("about_me");
  const facebook_url = formData.get("facebook_url");
  const twitter_url = formData.get("twitter_url");
  const instagram_url = formData.get("instagram_url");
  const linkedin_url = formData.get("linkedin_url");
  const vk_url = formData.get("vk_url");
  const telegram_url = formData.get("telegram_url");
  const youtube_url = formData.get("youtube_url");
  const pinterest_url = formData.get("pinterest_url");

  try {
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length == 0) {
      return res.status(404).json("user not found");
    }

    let query =
      "UPDATE users SET email = ?, username = ?, slug = ?, role = ?, about_me = ?, facebook_url = ?, twitter_url = ?, instagram_url = ?, pinterest_url = ?, linkedin_url = ?, vk_url = ?, telegram_url = ?, youtube_url = ?";

    let values = [
      email,
      username,
      slug,
      role,
      about_me,
      facebook_url,
      twitter_url,
      instagram_url,
      pinterest_url,
      linkedin_url,
      vk_url,
      telegram_url,
      youtube_url,
    ];

    if (avatar) {
      const primaryFolder = folderName;

      const primaryUploadDir = path.join(
        process.cwd(),
        "public/uploads/profile",
        primaryFolder
      );

      if (!fs.existsSync(primaryUploadDir)) {
        fs.mkdirSync(primaryUploadDir, { recursive: true });

        const htmlContent = `<!DOCTYPE html>
              <html>
              <head>
                <title>403 Forbidden</title>
              </head>
              <body>
                <p>Directory access is forbidden.</p>
              </body>
              </html>`;

        fs.writeFileSync(`${primaryUploadDir}/index.html`, htmlContent);
      }

      const imageFilename = avatar.name;
      const imageFileExtension = path.extname(imageFilename);
      const newImageName = `${uuidv4()}${imageFileExtension}`;
      const imagePath = path.join(primaryUploadDir, newImageName);

      // Save the image file
      const imageFileBuffer = Buffer.from(await avatar.arrayBuffer());
      fs.writeFileSync(imagePath, imageFileBuffer);

      const avatar = `uploads/profile/${folderName}/${newImageName}`;

      query += ", avatar = ?";

      values.push(avatar);
    }

    query += " WHERE id = ?";
    values.push(id);

    await db.execute(query, values);

    return NextResponse.json("updated");
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: "internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();
    await db.execute("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "user deleted successfully" });
  } catch (error) {
    console.error("Error deleting node:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
