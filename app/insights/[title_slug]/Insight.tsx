/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
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
import "./insight.css";
import { toast } from "react-toastify";

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
  const searchParams = useSearchParams();
  const id:any = searchParams.get("id");
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(false);


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
      setEmailConfirmed(true);
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
    if (!finalEmail) {
      toast.error("Enter your email first.");
      return;
    }
    if (!newThought.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (!userEmail && guestEmail.trim()) {
      sessionStorage.setItem("guestEmail", guestEmail.trim());
      setEmailConfirmed(true);
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
    toast.success("Post submitted successfully!");
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

  const handleEditSubmit = async (commentId: number) => {
    const formData = new FormData();
    formData.append("id", commentId.toString());
    formData.append("comment", sanitize(editText));
    if (editImage) formData.append("image", editImage);

    await fetch("/api/admin/insights/comments", {
      method: "PUT",
      body: formData,
    });

    setEditingId(null);
    setEditText("");
    setEditImage(null);
    fetchThoughts();
  };

  const handleDelete = async (commentId: number) => {
    const confirmed = confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    await fetch("/api/admin/insights/comments", {
      method: "DELETE",
      body: JSON.stringify({ id: commentId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

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
      <div className="d-md-none">
        <Button
          variant="primary"
          className="chat-floating-btn"
          onClick={() => setShowChat(true)}
        >
          💬
        </Button>
      </div>
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
            className="quill-content mb-4"
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
          {/* {(showAllThreads ? allInsights : allInsights.slice(0, 10)).map(
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
            )} */}
          <div className="mb-3 pb-1 border-bottom mt-4">
            <h5 className="mb-0">All Discussions</h5>
          </div>
          {parentThoughts.slice(0, visibleThoughts).map((t, i) => (
            <div key={i} className="mb-4 bg-light p-3 rounded border shadow-sm">
              <strong className="text-primary">{t.user_email}</strong>

              {editingId === t.id ? (
                <>
                  <textarea
                    className="form-control mb-2 mt-2"
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  />
                  <div>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditSubmit(t.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2">{t.comment}</p>
                  {t.image_url &&
                    (t.image_url.endsWith(".mp4") ? (
                      <video
                        controls
                        className="mb-2"
                        style={{
                          width: "100%",
                          maxWidth: "100%",
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
                          maxWidth: "100%",
                          borderRadius: "6px",
                        }}
                      />
                    ))}

                  <div className="mt-2">
                    {/* Show reply button only if NOT the comment owner */}
                    {userEmail !== t.user_email &&
                      guestEmail !== t.user_email && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            if (!userEmail && !guestEmail) {
                              const emailPrompt = prompt(
                                "Enter your email to reply:"
                              );
                              if (!emailPrompt || !emailPrompt.trim()) return;
                              sessionStorage.setItem(
                                "guestEmail",
                                emailPrompt.trim()
                              );
                              setGuestEmail(emailPrompt.trim());
                              setEmailConfirmed(true);
                            }
                            setReplyingTo(t.id);
                          }}
                        >
                          Reply
                        </Button>
                      )}

                    {/* Allow edit/delete for both guest and logged-in users */}
                    {(userEmail === t.user_email ||
                      guestEmail === t.user_email) && (
                      <>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-warning"
                          onClick={() => {
                            setEditingId(t.id);
                            setEditText(t.comment);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Reply input UI */}
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
                </>
              )}

              {/* Replies */}
              {getReplies(t.id).map((r, ri) => (
                <div
                  key={ri}
                  className="ms-3 mt-3 ps-3 border-start border-3 border-primary"
                >
                  <strong>{r.user_email}</strong>
                  <p className="mt-1 mb-2">{r.comment}</p>
                  {r.image_url &&
                    (r.image_url.endsWith(".mp4") ? (
                      <video
                        controls
                        className="mb-2"
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          borderRadius: "6px",
                        }}
                      >
                        <source src={`${imageBase}${r.image_url}`} />
                      </video>
                    ) : (
                      <img
                        src={`${imageBase}${r.image_url}`}
                        alt="reply"
                        className="mb-2"
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          borderRadius: "6px",
                        }}
                      />
                    ))}

                  {/* Edit/Delete reply if owner (guest or logged-in) */}
                  {(userEmail === r.user_email ||
                    guestEmail === r.user_email) && (
                    <div className="mt-2">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-warning"
                        onClick={() => {
                          setEditingId(r.id);
                          setEditText(r.comment);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
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
            {!userEmail && !emailConfirmed && (
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
        </Col>
      </Row>
      {showChat && (
  <div className="mobile-chat-overlay">
    <div className="chat-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
      <h5 className="mb-0">Discussions</h5>
      <Button size="sm" variant="danger" onClick={() => setShowChat(false)}>
        Close
      </Button>
    </div>

    <div className="chat-body p-3 overflow-auto" style={{ height: "70vh" }}>
      {parentThoughts.map((t) => (
        <div key={t.id} className="mb-3 bg-light p-2 rounded">
          <strong>{t.user_email}</strong>
          <p className="mb-1">{t.comment}</p>

          {getReplies(t.id).map((r) => (
            <div
              key={r.id}
              className="ms-3 mt-2 ps-2 border-start border-2 border-primary"
            >
              <strong>{r.user_email}</strong>
              <p className="mb-1">{r.comment}</p>
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="chat-footer border-top p-3 bg-white">
      {!userEmail && !emailConfirmed && (
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Your Email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
      )}
      <textarea
        className="form-control mb-2"
        rows={2}
        placeholder="Write something..."
        value={newThought}
        onChange={(e) => setNewThought(e.target.value)}
      />
      <div className="d-flex justify-content-between align-items-center">
        <input
          type="file"
          accept="image/*,video/mp4"
          onChange={handleMediaUpload}
          className="form-control me-2"
        />
        <Button variant="success" onClick={submitThought}>
          Send
        </Button>
      </div>
    </div>
  </div>
)}
    </Container>
  );
}
