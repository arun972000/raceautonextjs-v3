import React from "react";
import PostListCard from "../CategoryCard";
import PaginateComponent from "./paginate";
import Image from "next/image";

export type CateoryPostType = {
  id: number;
  title: string;
  title_slug: string;
  summary: string;
  created_at: any;
  image_description: string;
  image_big: string;
  image_mid: string;
};

const SubCategory = async ({
  page,
  categoryName,
}: {
  page: string;
  categoryName: string;
}) => {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }api/post/sub-category?sub=${categoryName}&page=${page || 1}`,
    {
      next: {
        revalidate: 600,
      },
    }
  );
  const data = await res.json();

  const post: CateoryPostType[] = data.results;

  const totalCount: number = data.totalpost;

  const adTopres = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/adspace/posts_top`
  );
  const adTopData = await adTopres.json();

  const adBottomres = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/adspace/posts_bottom`
  );
  const adBottomData = await adBottomres.json();

  return (
    <>
      <a href="https://raceinnovations.in/contact/" target="_blank">
        <div
          style={{ position: "relative", aspectRatio: "8.9/1", width: "100%" }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${adTopData[0].ad_code_728}`}
            alt="index top"
            fill
          />
        </div>
      </a>

      <div className="row my-3">
        {post.map((item) => (
          <PostListCard key={item.id} item={item} />
        ))}

        <a href="https://raceinnovations.in/contact/" target="_blank">
          <div
            style={{
              position: "relative",
              aspectRatio: "8.9/1",
              width: "100%",
            }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${adBottomData[0].ad_code_728}`}
              alt="index top"
              fill
            />
          </div>
        </a>
        <div className="d-flex justify-content-center my-4">
          <PaginateComponent totalCount={totalCount} />
        </div>
      </div>
    </>
  );
};

export default SubCategory;
