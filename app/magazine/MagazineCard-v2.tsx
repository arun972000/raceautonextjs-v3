"use client";
import Image from "next/image";
import React from "react";
import { Card } from "react-bootstrap";
import { magazineCardType } from "./Magazine";
import Link from "next/link";
import styles from "./page.module.css";

const MagazineCard_v2 = ({ item }: { item: magazineCardType }) => {
  return (
    <div className="col-lg-3">
      <Card>
      <Link href={`/magazine/${item.title_slug}`}>
        <div
        className={styles.magazinecardcontainer}
          style={{
            position: "relative",
            aspectRatio: "1/1.414",
            width: "100%",
          }}
        >
          <Image
          className={styles.magazinecard}
            alt={item.title}
            fill
            priority
            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_url}`}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, (max-width: 1200px) 40vw, 25vw"
          />
        </div>
        </Link>
      </Card>
    </div>
  );
};

export default MagazineCard_v2;
