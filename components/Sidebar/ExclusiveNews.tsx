import Image from "next/image";
import Link from "next/link";
import "./exclusive.css";

const ExclusiveNews = ({ item }: { item: any }) => {
  return (
    <div className="position-relative w-100">
      {/* Background Image */}
      <Link href={`/post/${item.title_slug}`} replace>
        <div className="position-relative w-100" style={{ aspectRatio: "16/9" }}>
          <Image
            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_mid}`} 
            alt={item.title}
            fill
            className="object-fit-cover"
          />

          {/* Overlay */}
          {/* <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div> */}

          {/* Title Banner at Bottom */}
          <div className="position-absolute bottom-0 start-0 w-100 bg-dark text-white text-center py-2">
            <h6 className="fs-5 m-0">{item.title}</h6>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExclusiveNews;
