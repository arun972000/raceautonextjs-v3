/* eslint-disable react/prop-types */
import { varientproptype } from "@/types/varient";
import Link from "next/link";
import Image from "next/image";
import "../Varient.css";
import { formatDate } from "@/components/Time";

const Varient4 = ({ item }: varientproptype) => {
  const truncatedTitle =
    item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title;

  return (
    <div className=" col-6 px-2">
      <div className="card border-0 card-no-bg">
        <Link className="link-style" href={`/post/${item.title_slug}`}>
          <div className="image-container">
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_mid}`}
              className="varient-image rounded"
              alt={item.title}
              fill
              priority
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, (max-width: 1200px) 40vw, 25vw"
            />
          </div>
          <div className="card-body pe-0">
            <h6 className="mt-1 p-0 card-heading">{truncatedTitle}</h6>
            {/* <p className="card-text small">{formatDate(item.created_at)}</p> */}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Varient4;
