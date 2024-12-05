import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RecommendedType } from "./Sidebar";
import { formatDate } from "../Time";

const RecommendedPost = ({ item }: { item: RecommendedType }) => {
  return (
    <>
      <div className="card border-0 mt-3">
        <Link className="link-style" href={`/post/${item.title_slug}`}>
          <div className="card-body">
            <div className="row">
              <div className="col-6">
                <div
                  style={{
                    aspectRatio: "16/9",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    crossOrigin="anonymous"
                    src={`${process.env.BACKEND_URL}${item.image_small}`}
                    alt={item.title}
                    fill
                    priority
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="content">
                  <h6 className="card-heading">
                    {item.title.length > 40
                      ? `${item.title.slice(0, 40)}...`
                      : item.title}
                  </h6>
                  <p className="card-text text-muted small">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default RecommendedPost;
