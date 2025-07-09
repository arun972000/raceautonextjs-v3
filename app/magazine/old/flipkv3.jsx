/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
"use client";
import "core-js/full/promise/with-resolvers";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { IoExit, IoVolumeHighSharp, IoVolumeMuteSharp } from "react-icons/io5";
import { IoIosPlay, IoMdDownload, IoMdExit, IoMdPause } from "react-icons/io";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaCheck, FaPrint } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import "./flip_v2.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { jwtDecode } from "jwt-decode";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Page = forwardRef(({ pageNumber }, ref) => {
  return (
    <div ref={ref}>
      <ReactPdfPage pageNumber={pageNumber} width={360} />
    </div>
  );
});

function TestMobile({ token, pdfData }) {
  const book = useRef();
  const router = useRouter();
  const params = useParams();
  const { title_slug } = params;
  const [pdf_url, setPdf_url] = useState("");
  const [file, setFile] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pdfloading, setPdfloading] = useState(true);
  const [volume, setVolume] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [subcriptionData, setSubcriptionData] = useState([]);
  // Decode token; default to role "user" if none provided
  const decoded = token ? jwtDecode(token) : { email: "", role: "user" };
  const autoplayRef = useRef(null);

  // Grant access if user role is admin, ad team, or moderator OR subscription status is Active.
  const showActionButtons =
    ["admin", "ad team", "moderator"].includes(decoded.role) ||
    (subcriptionData.length !== 0 && subcriptionData[0]?.status === "Active");

  // const pdfData = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}api/magazine/${title_slug}`
  //     );
  //     setPdf_url(res.data[0].pdf_url);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const subscriptionApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/purchase/${decoded.email}`
      );
      setSubcriptionData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const flipNextPage = () => {
    book.current.pageFlip().flipNext("top");
    setCurrentPage((prev) => prev + 1);
  };

  const handleLoadSuccess = async (pdfObject) => {
    const totalPages = pdfObject.numPages;
    setTotalPage(totalPages);
    setPdfloading(false);
    const data = await pdfObject.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setFile(URL.createObjectURL(blob));
  };

  const handleLoadProgress = ({ loaded, total }) => {
    setLoadingProgress((loaded / total) * 100);
  };

  const startAutoplay = () => {
    if (!isAutoplay) {
      setIsAutoplay(true);
      autoplayRef.current = setInterval(flipNextPage, 2000);
    }
  };

  const stopAutoplay = () => {
    setIsAutoplay(false);
    clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  };

  const toggleAutoplay = () => {
    if (isAutoplay) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  const onFlip = useCallback(() => {
    const audio = new Audio("/turnpage-99756.mp3");
    if (!volume) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [volume]);

  const pagesMap = new Array(totalPage).fill(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight") {
        book.current.pageFlip().flipNext();
      } else if (e.key === "ArrowLeft") {
        book.current.pageFlip().flipPrev();
      }
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const startX = touch.clientX;
      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const currentX = touch.clientX;
        if (currentX - startX > 50) {
          book.current.pageFlip().flipPrev();
          window.removeEventListener("touchmove", handleTouchMove);
        } else if (startX - currentX > 50) {
          book.current.pageFlip().flipNext();
          window.removeEventListener("touchmove", handleTouchMove);
        }
      };

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener(
        "touchend",
        () => {
          window.removeEventListener("touchmove", handleTouchMove);
        },
        { once: true }
      );
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // pdfData();

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const frameRef = useRef(null);

  useEffect(() => {
    if (currentPage > totalPage) {
      stopAutoplay();
    }
  }, [currentPage]);

  useEffect(() => {
    if (decoded.email !== "") {
      subscriptionApi();
    }
  }, []);

  return (
    <>
      {file && (
        <iframe ref={frameRef} src={file} style={{ display: "none" }}></iframe>
      )}

      {pdfloading && (
        <div className="d-flex justify-content-center mt-2">
          <Skeleton height={510} width={360} />
        </div>
      )}
      <Document
        file={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${pdfData}`}
        style={{ width: "100%", aspectRatio: "1.4/1" }}
        onLoadSuccess={handleLoadSuccess}
        onLoadProgress={handleLoadProgress}
        onLoadError={(error) => {
          console.error("Error loading PDF: ", error);
          setPdfloading(false);
        }}
      >
        <HTMLFlipBook
          width={360}
          height={510}
          ref={book}
          showCover={true}
          onFlip={onFlip}
          flippingTime={500}
          disableFlipByClick={!isMobile}
          swipeDistance={20}
          clickEventForward={false}
          showPageCorners={false}
          style={{ overflow: "hidden" }}
        >
          {pagesMap.map((item, i) => (
            <Page key={i} pageNumber={i + 1} scale={2.0} />
          ))}
        </HTMLFlipBook>
      </Document>
      {!pdfloading && (
        <div className="row mt-2 justify-content-center align-items-center">
          <div
            className="d-flex justify-content-center pt-1"
            style={{ zIndex: 99, color: "black" }}
          >
            <GrFormPrevious
              title="Previous"
              onClick={() => {
                book.current.pageFlip().flipPrev("top");
                if (currentPage !== 1) {
                  setCurrentPage((pre) => pre - 1);
                }
              }}
              style={{
                cursor: "pointer",
                background: "#32bea6",
                borderRadius: 100,
              }}
              className="mx-2"
              color="white"
              size={23}
            />

            <div>
              <input
                type="number"
                min="0"
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const pageNumberInt = parseInt(pageNumber);
                    if (pageNumberInt > totalPage) {
                      book.current.pageFlip().flip(totalPage - 1);
                    } else {
                      book.current.pageFlip().flip(pageNumberInt - 1);
                    }
                  }
                }}
                style={{ width: "50px" }}
              />
              <button
                title="Go To"
                className="btn btn-dark p-0 px-1 m-0 mb-1 me-1"
                style={{
                  cursor: "pointer",
                  background: "#32bea6",
                  borderRadius: 0,
                }}
                onClick={() => {
                  const pageNumberInt = parseInt(pageNumber);
                  if (pageNumberInt > totalPage) {
                    book.current.pageFlip().flip(totalPage - 1);
                  } else {
                    book.current.pageFlip().flip(pageNumberInt - 1);
                  }
                }}
              >
                <FaCheck />
              </button>
            </div>
            <GrFormNext
              title="Next"
              onClick={() => {
                book.current.pageFlip().flipNext("top");
                if (currentPage !== totalPage / 2) {
                  setCurrentPage((pre) => pre + 1);
                }
              }}
              style={{
                cursor: "pointer",
                background: "#32bea6",
                color: "white",
                borderRadius: 100,
              }}
              className="mx-2"
              size={23}
            />
            {showActionButtons && (
              <div onClick={toggleAutoplay}>
                {isAutoplay ? (
                  <IoMdPause
                    title="Pause"
                    className="mx-2 p-1"
                    color="white"
                    size={23}
                    style={{
                      cursor: "pointer",
                      background: "#32bea6",
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <IoIosPlay
                    title="AutoPlay"
                    className="mx-2 p-1"
                    color="white"
                    size={23}
                    style={{
                      cursor: "pointer",
                      background: "#32bea6",
                      borderRadius: 100,
                    }}
                  />
                )}
              </div>
            )}
            {volume ? (
              <IoVolumeMuteSharp
                title="Volume"
                onClick={() => {
                  setVolume(false);
                }}
                style={{
                  cursor: "pointer",
                  background: "#32bea6",
                  borderRadius: 100,
                }}
                className="mx-2 p-1"
                size={23}
              />
            ) : (
              <IoVolumeHighSharp
                title="Volume"
                onClick={() => {
                  setVolume(true);
                }}
                color="white"
                style={{
                  cursor: "pointer",
                  background: "#32bea6",
                  borderRadius: 100,
                }}
                className="mx-2 p-1"
                size={23}
              />
            )}
            {showActionButtons && (
              <a
                href={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${pdfData}`}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMdDownload
                  size={23}
                  title="Download"
                  color="white"
                  className="mx-2 p-1"
                  style={{
                    cursor: "pointer",
                    background: "#32bea6",
                    borderRadius: 100,
                  }}
                />
              </a>
            )}
            {showActionButtons && (
              <FaPrint
                onClick={() => frameRef?.current?.contentWindow.print()}
                title="Print"
                color="white"
                style={{
                  cursor: "pointer",
                  background: "#32bea6",
                  borderRadius: 100,
                }}
                className="mx-2 p-1"
                size={23}
              />
            )}

            <IoMdExit
              title="Exit"
              color="white"
              onClick={() => {
                router.push("/magazine");
              }}
              style={{
                cursor: "pointer",
                background: "#32bea6",
                borderRadius: 100,
              }}
              className="mx-2 p-1"
              size={23}
            />

          </div>
        </div>
      )}
      <audio ref={autoplayRef}>
        <source src="/turnpage-99756.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
}

export default TestMobile;
