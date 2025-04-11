/* eslint-disable react/no-unescaped-entities */
import React from "react";
import PostSlider from "./Slider";
import Link from "next/link";
import SocialButton from "./SocialButton";
import { formatDate } from "@/components/Time";
import PostContent from "./postContent";
import { cookies } from "next/headers";
import EditButton from "./AdminButtons";
import Image from "next/image";
import AdArticleMiddle from "@/components/GoogleAds/AdArticleMiddle";

export type postsliderType = {
  image_default: string;
};

type TagType = {
  id: number;
  tag: string;
  tag_slug: string;
};

export type postType = {
  id: number;
  title: string;
  summary: string;
  created_at: any;
  images: postsliderType[];
  image_description: string;
  content: string;
  image_big: string;
  image_default: string;
  image_mid: string;
  tag: TagType[];
  keywords: [];
  main_category_color: string;
  sub_category_color: string;
  main_category: string;
  sub_category: string;
  is_recommended: any;
};

async function incrementPageView(pageUrl: string) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/pageincrement/${pageUrl}`,
      {
        method: "PUT",
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Error incrementing page view:", error);
  }
}

const Post = async ({
  title,
  is_recommended,
}: {
  title: string;
  is_recommended: any;
}) => {
  await incrementPageView(title);

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/post/single-post/${title}`
  );
  const data: postType[] = await res.json();

  const post = data[0];

  const adTopres = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/adspace/post_top`
  );
  const adTopData = await adTopres.json();

  const adBottomres = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/adspace/post_bottom`
  );
  const adBottomData = await adBottomres.json();

  return (
    <>
      <div className="col-lg-8 mt-3">
        {/* <div
          style={{ position: "relative", aspectRatio: "8.9/1", width: "100%" }}
          className="my-2"
        >
          <a href="https://raceinnovations.in/contact/" target="_blank">
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${adTopData[0].ad_code_728}`}
              alt="index top"
              fill
            />
          </a>
        </div> */}

        <div>
          {(token || token !== undefined) && (
            <EditButton token={token.value} id={post.id} />
          )}

          <h1>
            <b>{post.title}</b>
          </h1>
          <div className="my-2">
            <span
              style={{
                backgroundColor: post.main_category_color,
                borderRadius: 30,
                fontSize: "small",
              }}
              className="py-1 px-2 me-1"
            >
              {post.main_category}
            </span>{" "}
            {"|"}
            <span
              style={{
                backgroundColor: post.sub_category_color,
                borderRadius: 30,
                fontSize: "small",
              }}
              className="ms-2 py-1 px-2"
            >
              {post.sub_category}
            </span>
          </div>

          <p className="post-summary">{post.summary}</p>
          <small className="">Date: {formatDate(post.created_at)} </small>
          <SocialButton title_slug={title} />
          <hr />
        </div>
        <PostSlider images={post.images} title={post.title} />
        <p
          className="text-muted text-center mt-2"
          style={{ fontSize: "small" }}
        >
          {post.image_description}
        </p>
        <AdArticleMiddle />
        <PostContent
          content={post.content}
          token={token?.value}
          is_recommended={is_recommended}
        />
        {post.tag.map((item) => (
          <Link href={`/tag/${item.tag_slug}`} key={item.id}>
            <span className="badge badge-primary mr-3" style={{ color: "red" }}>
              {item.tag}
            </span>
          </Link>
        ))}
        {/* <div
          className="mt-2"
          style={{ position: "relative", aspectRatio: "8.9/1", width: "100%" }}
        >
          <a href="https://raceinnovations.in/contact/" target="_blank">
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${adBottomData[0].ad_code_728}`}
              alt="index top"
              fill
            />
          </a>
        </div> */}
      </div>
    </>
  );
};

export default Post;
