/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
"use client";

import "core-js/full/promise/with-resolvers";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { IoExit, IoVolumeHighSharp, IoVolumeMuteSharp } from "react-icons/io5";
import { Carousel } from "react-bootstrap";
import {
  IoIosPlay,
  IoMdDownload,
  IoMdExit,
  IoMdPause,
  IoMdAdd,
  IoMdRemove,
} from "react-icons/io";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./flip_v2.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Page = forwardRef(({ pageNumber, zoomLevel }, ref) => (
  <div ref={ref}>
    <ReactPdfPage pageNumber={pageNumber} width={360 * zoomLevel} />
  </div>
));

export default function TestMobile({ token, pdfData }) {
  const book = useRef();
  const router = useRouter();
  const { title_slug } = useParams();
  const [totalPage, setTotalPage] = useState(0);
  const [pdfloading, setPdfloading] = useState(true);
  const [volume, setVolume] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [articleResults, setArticleResults] = useState([]);
  const autoplayRef = useRef(null);

  const decoded = token ? jwtDecode(token) : { email: "", role: "user" };
  const showActionButtons =
    ["admin", "ad team", "moderator"].includes(decoded.role);

  // Autoplay controls
  const startAutoplay = () => {
    if (!isAutoplay) {
      setIsAutoplay(true);
      autoplayRef.current = setInterval(
        () => book.current.pageFlip().flipNext(),
        2000
      );
    }
  };
  const stopAutoplay = () => {
    setIsAutoplay(false);
    clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  };
  const toggleAutoplay = () =>
    isAutoplay ? stopAutoplay() : startAutoplay();

  // onFlip: play sound, extract text, send to API, update results
  const onFlip = useCallback(async (e) => {
    const isFreeUser = !["admin", "ad team", "moderator"].includes(decoded.role) ||
      (subcriptionData.length === 0 || new Date(subcriptionData[0].end_date) < new Date());

    if (isFreeUser) return;
    const audio = new Audio("/turnpage-99756.mp3");
    if (!volume) audio.play();

    try {
      const pageIndex = e.data || currentPage - 1;
      const pdfUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${pdfData}`;
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdfDoc = await loadingTask.promise;
      const pageObj = await pdfDoc.getPage(pageIndex + 1);
      const txtContent = await pageObj.getTextContent();
      const text = txtContent.items.map((item) => item.str).join(" ");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/search-youtube`,
        { text }
      );

      const {
        youtubeVideos = [],
        postResults = [],
      } = response.data;

      setYoutubeResults(youtubeVideos);
      setArticleResults(postResults);
    } catch (err) {
      console.error("Error extracting or sending content:", err);
    }
  }, [volume, pdfData]);

  // PDF load handlers
  const handleLoadSuccess = ({ numPages }) => {
    setTotalPage(numPages);
    setPdfloading(false);
  };
  const handleLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfloading(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") book.current.pageFlip().flipNext();
      if (e.key === "ArrowLeft") book.current.pageFlip().flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pagesMap = new Array(totalPage).fill(0);

  return (
    <>
      {pdfloading && (
        <div className="d-flex justify-content-center mt-2">
          <Skeleton height={510} width={360} />
        </div>
      )}

      <Document
        file={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${pdfData}`}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
      >
        <HTMLFlipBook
          width={180}
          height={254.52}
          ref={book}
          showCover
          onFlip={onFlip}
          flippingTime={500}
          disableFlipByClick
          swipeDistance={20}
          clickEventForward={false}
          showPageCorners={false}
          style={{ overflow: "hidden" }}
        >
          {pagesMap.map((_, i) => (
            <Page key={i} pageNumber={i + 1} zoomLevel={zoomLevel} />
          ))}
        </HTMLFlipBook>
      </Document>

      {!pdfloading && (
        <div className="row mt-2 justify-content-center align-items-center">
          <div className="d-flex justify-content-center pt-1" style={{ zIndex: 99 }}>
            <GrFormPrevious
              title="Previous"
              onClick={() => book.current.pageFlip().flipPrev()}
              style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
              className="mx-2 p-1"
              size={23}
            />

            <GrFormNext
              title="Next"
              onClick={() => book.current.pageFlip().flipNext()}
              style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
              className="mx-2 p-1"
              size={23}
            />

            {showActionButtons && (
              volume ? (
                <IoVolumeMuteSharp
                  title="Mute"
                  onClick={() => setVolume(false)}
                  style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                  className="mx-2 p-1"
                  size={23}
                />
              ) : (
                <IoVolumeHighSharp
                  title="Volume"
                  onClick={() => setVolume(true)}
                  style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                  className="mx-2 p-1"
                  size={23}
                />
              )
            )}

            {showActionButtons && (
              <div onClick={toggleAutoplay}>
                {isAutoplay ? (
                  <IoMdPause
                    title="Pause"
                    className="mx-2 p-1"
                    style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                    size={23}
                  />
                ) : (
                  <IoIosPlay
                    title="AutoPlay"
                    className="mx-2 p-1"
                    style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                    size={23}
                  />
                )}
              </div>
            )}

            {showActionButtons && (
              <>
                <IoMdAdd
                  title="Zoom In"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 3))}
                  className="mx-2 p-1"
                  style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                  size={23}
                />
                <IoMdRemove
                  title="Zoom Out"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}
                  className="mx-2 p-1"
                  style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                  size={23}
                />
              </>
            )}

            {showActionButtons && (
              <a
                href={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${pdfData}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 p-1"
                style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
              >
                <IoMdDownload title="Download" size={23} color="white" />
              </a>
            )}

            {showActionButtons && (
              <FaPrint
                onClick={() => window.print()}
                title="Print"
                className="mx-2 p-1"
                style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
                size={23}
              />
            )}

            <IoMdExit
              title="Exit"
              onClick={() => router.push("/magazine")}
              className="mx-2 p-1"
              style={{ cursor: "pointer", background: "#32bea6", borderRadius: 100 }}
              size={23}
            />
          </div>
        </div>
      )}

      {showActionButtons ? (
        <>
          {youtubeResults.length > 0 && (
            <div className="mt-4 px-4">
              <h3 style={{ color: "white", marginBottom: 8 }}>YouTube Previews</h3>
              <Carousel interval={4000} pause={false} key={youtubeResults.map(v => v.id).join("-")}>
                {youtubeResults.map((video) => (
                  <Carousel.Item key={video.id}>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="d-block w-100"
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    </a>
                    <Carousel.Caption>
                      <p style={{ color: "white", backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 8px", fontSize: "14px" }}>
                        {video.title}
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          )}

          {articleResults.length > 0 && (
            <div className="mt-4 px-4">
              <h3 style={{ color: "white", marginBottom: 8 }}>Related Articles</h3>
              <Carousel interval={4000} pause={false} key={articleResults.map(a => a.id || a.title).join("-")}>
                {articleResults.map((article, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="p-3 bg-dark rounded d-flex flex-column align-items-center">
                      {article.image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${article.image}`}
                          alt={article.title}
                          className="mb-3"
                          style={{ maxHeight: 200, borderRadius: 6, objectFit: "cover" }}
                        />
                      )}
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#32bea6", textDecoration: "none" }}
                      >
                        <h5 className="text-center" style={{ fontSize: "16px" }}>{article.title}</h5>
                      </a>
                      <p style={{ color: "white", marginTop: 4, textAlign: "center", fontSize: "14px" }}>
                        {article.snippet}
                      </p>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 px-3 position-relative">
          {/* Blurred Placeholder */}
          <div
            className="bg-dark rounded overflow-hidden"
            style={{
              filter: "blur(5px)",
              pointerEvents: "none",
              userSelect: "none",
              height: 200,
              position: "relative",
            }}
          >
            <Carousel interval={4000} pause={false}>
              {[1, 2].map((_, idx) => (
                <Carousel.Item key={idx}>
                  <div
                    style={{
                      height: 250,
                      backgroundColor: "#1c1c1c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: "16px",
                    }}
                  >
                    Preview Locked – Subscribe to Unlock
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          {/* Lock Icon */}
          {/* <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 3,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: "50%",
                    padding: 8,
                  }}
                >
                  <FaLock size={18} color="#fff" />
                </div> */}

          {/* Subscription Overlay Box */}
          <div
            className="position-absolute top-50 start-50 translate-middle text-center px-3"
            style={{
              zIndex: 4,
              background: "rgba(0,0,0,0.85)",
              padding: "16px 20px",
              borderRadius: "10px",
              border: "1px solid #32bea6",
              maxWidth: 320,
              width: "90%",
            }}
          >
            <h5 style={{ color: "#32bea6", fontWeight: "bold", fontSize: "18px" }}>
              Premium Content
            </h5>
            <p style={{ color: "#eee", fontSize: "14px", marginBottom: "12px" }}>
              YouTube previews and related articles are available only to subscribers.
            </p>
            <Link href="/subscription">
              <button
                className="btn"
                style={{
                  backgroundColor: "#32bea6",
                  color: "white",
                  fontWeight: 600,
                  padding: "6px 18px",
                  fontSize: "14px",
                }}
              >
                🔓 Unlock Now
              </button>
            </Link>
          </div>
        </div>
      )}

    </>
  );
}
