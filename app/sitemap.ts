import db from "@/lib/db";
import { MetadataRoute } from "next";

// Helper function to check if a date is valid
const isValidDate = (date: string): boolean => !isNaN(Date.parse(date));

// Helper function to format a date to ISO string
const getISOString = (date: string) => {
  return isValidDate(date)
    ? new Date(date).toISOString()
    : new Date().toISOString();
};

function escapeXML(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return char;
    }
  });
}

// Function to dynamically generate the sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles]: any = await db.execute(
    `SELECT title, title_slug, updated_at, image_mid FROM posts`
  );
  const [mainCategory]: any = await db.execute(
    `SELECT id, name, name_slug FROM categories WHERE parent_id = 0`
  );
  const [tags]: any = await db.execute(
    `SELECT DISTINCT tag, tag_slug FROM tags`
  );
  const [pages]: any = await db.execute(
    `SELECT id, title, slug FROM pages WHERE title IN ('contact', 'Terms & Conditions', 'About Us', 'Support', 'Privacy', 'Events', 'Links')`
  );
  const [market]: any = await db.execute(
    `SELECT title, title_slug FROM post_market`
  );

  // Generate the URLs for different types of content
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...pages.map((page: any) => ({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/page/${page.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
    ...market.map((page: any) => ({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/market/${page.title_slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    })),
    ...mainCategory.map((category: any) => ({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${category.name_slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...articles.map((article: any) => ({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${escapeXML(
        article.title_slug
      )}`,
      lastModified: getISOString(article.updated_at),
      changeFrequency: "daily",
      priority: 0.9,
      images: article.image_mid
        ? [
            {
              url: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${article.image_mid}`,
              caption: article.title,
              title: article.title,
            },
          ]
        : [],
      news: {
        publication: {
          name: "Race Auto India",
          language: "en",
        },
        publication_date: getISOString(article.updated_at),
        title: article.title,
      },
    })),
    // ...tags.map((tag: any) => ({
    //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tag/${tag.tag_slug}`,
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // })),
  ];

  return sitemap;
}
