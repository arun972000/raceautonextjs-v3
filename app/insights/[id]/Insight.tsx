/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];
const badWords = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "dick",
  "piss",
  "cunt",
  "damn",
  "hell",
  "crap",
  "slut",
  "fag",
  "retard",
  "idiot",
  "moron",
  "suck",
  "whore",
  "nigger",
  "bloody",
  "bollocks",
  "bugger",
  "arse",
  "wanker",
  "twat",
];
const sanitize = (text: string) => {
  const regex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
  return text.replace(regex, "***");
};

export default function InsightDetailPage() {
  const { id } = useParams();
  const [insight, setInsight] = useState<any>(null);
  const [allInsights, setAllInsights] = useState<any[]>([]);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [newThought, setNewThought] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [uploadMedia, setUploadMedia] = useState<File | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [visibleThoughts, setVisibleThoughts] = useState(5);
  const [showAllThreads, setShowAllThreads] = useState(false);
  const imageBase = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserEmail(decoded?.email);
    }

    const storedGuestEmail = sessionStorage.getItem("guestEmail");
    if (!token && storedGuestEmail) {
      setGuestEmail(storedGuestEmail);
    }

    if (id) {
      fetchInsight();
      fetchThoughts();
    }

    fetchTopThreads();
  }, [id]);

  const fetchInsight = async () => {
    const res = await fetch(`/api/admin/insights/${id}`);
    const data = await res.json();
    setInsight(data);
  };

  const fetchThoughts = async () => {
    const res = await fetch(`/api/admin/insights/comments?insight_id=${id}`);
    const data = await res.json();
    setThoughts(data);
  };

  const fetchTopThreads = async () => {
    const res = await fetch(`/api/admin/insights`);
    const data = await res.json();
    if (data.success) setAllInsights(data.insights);
  };

  const handleMediaUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (isImage && file.size > 300 * 1024)
      return alert("Image must be under 300KB");
    if (isVideo && file.size > 5 * 1024 * 1024)
      return alert("Video must be under 5MB");
    setUploadMedia(file);
  };

  const submitThought = async (e: FormEvent) => {
    e.preventDefault();
    const finalEmail = userEmail || guestEmail.trim();
    if (!finalEmail) return alert("Enter email first.");
    if (!newThought.trim()) return;

    if (!userEmail) {
      sessionStorage.setItem("guestEmail", finalEmail);
      setGuestEmail(finalEmail);
    }

    const formData = new FormData();
    formData.append("insight_id", id.toString());
    formData.append("user_email", finalEmail);
    formData.append("comment", sanitize(newThought));
    if (uploadMedia) formData.append("image", uploadMedia);

    await fetch("/api/admin/insights/comments", {
      method: "POST",
      body: formData,
    });

    setNewThought("");
    setUploadMedia(null);
    fetchThoughts();
  };

  const submitReply = async (parentId: number) => {
    if (!replyText.trim()) return;
    const finalEmail = userEmail || guestEmail.trim();
    if (!finalEmail) return alert("Enter email first.");

    const formData = new FormData();
    formData.append("insight_id", id.toString());
    formData.append("user_email", finalEmail);
    formData.append("comment", sanitize(replyText));
    formData.append("parent_id", parentId.toString());

    await fetch("/api/admin/insights/comments", {
      method: "POST",
      body: formData,
    });

    setReplyText("");
    setReplyingTo(null);
    fetchThoughts();
  };

  const renderGraph = (chart: any) => {
    switch (chart.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chart.data.map((entry: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const parentThoughts = thoughts.filter((c) => !c.parent_id);
  const getReplies = (parentId: number) =>
    thoughts.filter((c) => c.parent_id === parentId);

  if (!insight) return <div>Loading...</div>;

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8}>
          <h3 dangerouslySetInnerHTML={{ __html: insight.title }} />
          {insight.images?.length > 0 && (
            <div
              className="mb-4"
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                loop
              >
                {insight.images.map((file: string, i: number) => (
                  <SwiperSlide key={i}>
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                      }}
                    >
                      {file.endsWith(".mp4") ? (
                        <video
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        >
                          <source src={`${imageBase}${file}`} />
                        </video>
                      ) : (
                        <img
                          src={`${imageBase}${file}`}
                          alt="media"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div
            dangerouslySetInnerHTML={{ __html: insight.content }}
            className="mb-4"
          />

          {insight.charts?.map((chart: any, idx: number) => (
            <div key={idx} className="p-3 border rounded bg-light mb-4">
             
              {chart.heading && <h5 className="mb-2">{chart.heading}</h5>}
              {renderGraph(chart)}
            </div>
          ))}

          {insight.quotes && (
            <blockquote
              className="blockquote px-4 py-3 border-start border-4 border-primary mb-4"
              dangerouslySetInnerHTML={{ __html: insight.quotes }}
            />
          )}
          {insight.notes && (
            <div>
             
              <div dangerouslySetInnerHTML={{ __html: insight.notes }} />
            </div>
          )}
        </Col>

        <Col md={4}>
          <div className="mb-3 pb-1 border-bottom">
            <h5 className="mb-0">Top Threads</h5>
          </div>
          <div className="border rounded bg-light shadow-sm">
            {(showAllThreads ? allInsights : allInsights.slice(0, 10)).map(
              (ins) => (
                <div key={ins.id} className="px-3 py-2 border-bottom">
                  <a
                    href={`/insights/${ins.id}`}
                    className="text-decoration-none text-dark fw-semibold d-block"
                    dangerouslySetInnerHTML={{ __html: ins.title }}
                  />
                </div>
              )
            )}
            {allInsights.length > 10 && !showAllThreads && (
              <div className="text-center py-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowAllThreads(true)}
                >
                  View more threads
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12}>
          <div className="mb-3 pb-1 border-bottom">
            <h5 className="mb-0">Share Your Thoughts</h5>
          </div>
          <div
            className="p-4 rounded border shadow-sm mb-5"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            {!userEmail && !guestEmail && (
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Enter your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            )}
            <form onSubmit={submitThought}>
              <textarea
                className="form-control mb-2"
                rows={3}
                placeholder="Write your thoughts..."
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
              />
              <input
                type="file"
                className="form-control mb-2"
                accept="image/*,video/mp4"
                onChange={handleMediaUpload}
              />
              <Button type="submit" variant="primary">
                Post
              </Button>
            </form>
          </div>

          <div className="mb-3 pb-1 border-bottom">
            <h5 className="mb-0">All Discussions</h5>
          </div>

          {parentThoughts.slice(0, visibleThoughts).map((t, i) => (
            <div key={i} className="mb-4 bg-light p-3 rounded border shadow-sm">
              <strong className="text-primary">{t.user_email}</strong>
              <p className="mt-2">{t.comment}</p>
              {t.image_url &&
                (t.image_url.endsWith(".mp4") ? (
                  <video
                    controls
                    className="mb-2"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      borderRadius: "6px",
                    }}
                  >
                    <source src={`${imageBase}${t.image_url}`} />
                  </video>
                ) : (
                  <img
                    src={`${imageBase}${t.image_url}`}
                    alt="reply"
                    className="mb-2"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      borderRadius: "6px",
                    }}
                  />
                ))}
              <div className="mt-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setReplyingTo(t.id)}
                >
                  Reply
                </Button>
                {replyingTo === t.id && (
                  <div className="mt-2">
                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => submitReply(t.id)}
                    >
                      Post Reply
                    </Button>
                  </div>
                )}
              </div>
              {getReplies(t.id).map((r, ri) => (
                <div
                  key={ri}
                  className="ms-3 mt-3 ps-3 border-start border-3 border-primary"
                >
                  <strong>{r.user_email}</strong>
                  <p className="mb-1">{r.comment}</p>
                </div>
              ))}
            </div>
          ))}

          {parentThoughts.length > visibleThoughts && (
            <div className="text-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setVisibleThoughts((prev) => prev + 5)}
              >
                View more discussions
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
