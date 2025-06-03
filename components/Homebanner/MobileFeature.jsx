import React from "react";
import Image from "next/image";
import Link from "next/link";

function MobileFeature({ featureList }) {
    const truncateSummary = (text, maxLength = 60) =>
        text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    const truncateTitle = (text, maxWords = 6) => {
        if (!text) return "";
        const words = text.trim().split(/\s+/);
        return words.length > maxWords
            ? words.slice(0, maxWords).join(" ") + "..."
            : text;
    };

    return (
        <div className="container-fluid border-bottom border-2 mt-3">
            {featureList?.slice(0, 2).map((item, index) => {
                const title = truncateTitle(item.title || "Default Title");
                const summary = truncateSummary(item.summary || "No summary available.");
                const imageSrc = item.image_mid
                    ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_default}`
                    : "/default.png";

                return (
                    <Link className="link-style" href={`/post/${item.title_slug}`} key={index}>
                        <div className="row mb-2" >
                            <div className="col-7">
                                <div
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        aspectRatio: "16/9",
                                    }}
                                >
                                    <Image
                                        src={imageSrc}
                                        alt={item.title || "news image"}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ objectFit: "cover" }}
                                        className="rounded"
                                        unoptimized={false} // Let Next optimize if remote image is configured properly
                                    />
                                </div>
                            </div>
                            <div className="col-5 px-0">
                                <h6 className=" fs-6 mb-1">
                                    <small>{title}</small>
                                </h6>
                                <p className="text-muted fs-7 mb-0">
                                    <small>{summary}</small>
                                </p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default MobileFeature;
