import { formatDate } from "@/components/Time";
import { varientproptype } from "@/types/varient";
import Image from "next/image";
import Link from "next/link";

const SubCardV5_1 = ({ item }: varientproptype) => {
  return (
    <div className="mb-1 border-0 mb-3 card card-no-bg">
      <Link className="link-style" href={`/post/${item.title_slug}`}>
        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <div className="image-container">
                <Image
                  src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_mid}`}
                  className="varient-image"
                  alt={item.title}
                  fill
                  priority
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="content">
                <p className="card-heading">{item.title}</p>

                <p className="card-text small">{formatDate(item.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SubCardV5_1;
