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
    `${process.env.BACKEND_URL}api/post/sub-category?sub=${categoryName}&page=${
      page || 1
    }`,
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
    `${process.env.BACKEND_URL}api/admin/adspace/category_top`
  );
  const adTopData = await adTopres.json();

  const adBottomres = await fetch(
    `${process.env.BACKEND_URL}api/admin/adspace/category_bottom`
  );
  const adBottomData = await adBottomres.json();

  return (
    <>
      <div
        style={{ position: "relative", aspectRatio: "8.9/1", width: "100%" }}
      >
        <Image
          src={`${process.env.BACKEND_URL}${adTopData[0].ad_code_728}`}
          alt="index top"
          fill
        />
      </div>
      <div className="row my-3">
        {post.map((item) => (
          <PostListCard key={item.id} item={item} />
        ))}
        <PaginateComponent totalCount={totalCount} />
      </div>
      <div
        style={{ position: "relative", aspectRatio: "8.9/1", width: "100%" }}
      >
        <Image
          src={`${process.env.BACKEND_URL}${adBottomData[0].ad_code_728}`}
          alt="index top"
          fill
        />
      </div>
    </>
  );
};

export default SubCategory;
