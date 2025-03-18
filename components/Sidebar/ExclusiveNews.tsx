import Image from "next/image";
import Link from "next/link";
import "./exclusive.css";

const ExclusiveNews = ({ item }: { item: any }) => {
  return (
    <div className="">
      {/* Background Image */}
      <Link href={`/post/${item.title_slug}`} replace>
        <div
          style={{ position: "absolute", width: "100%", aspectRatio: "16/9" }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_mid}`} // Ensure this contains the correct image URL
            alt={item.title}
            fill
          />
        </div>
      </Link>
    </div>
  );
};

export default ExclusiveNews;
