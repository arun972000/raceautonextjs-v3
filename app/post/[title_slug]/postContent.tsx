/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AuthModal from "@/app/test/components/LoginFormTest";
import Link from "next/link";
import Image from "next/image";

// Vulgar word filter
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

function sanitizeComment(comment: string) {
  const regex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
  return comment.replace(regex, "***");
}

const PostContent = ({
  content,
  token,
  is_recommended,
  postId,
}: {
  content: string;
  token: any;
  is_recommended: any;
  postId: number;
}) => {
  const [showAuth, setShowAuth] = useState(false);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>("");
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [postReactions, setPostReactions] = useState<any>({});
  const [userPostReaction, setUserPostReaction] = useState<string | null>(null);

  const decoded: any = token ? jwtDecode(token) : null;
  const shouldLimitContent = !decoded && is_recommended == 1;

  useEffect(() => {
    document.addEventListener("copy", handleCopy);
    fetchComments();
    fetchPostReactions();
    return () => document.removeEventListener("copy", handleCopy);
  }, []);

  const fetchPostReactions = async () => {
    try {
      const res = await axios.get(
        `/api/admin/comments/reactions?post_id=${postId}`
      );
      const stats = Object.fromEntries(
        res.data.map((r: any) => [r.reaction_type, r.count])
      );
      setPostReactions(stats);

      if (decoded?.email) {
        const userRes = await axios.get(
          `/api/admin/comments/reactions/user?post_id=${postId}&email=${decoded.email}`
        );
        setUserPostReaction(userRes.data?.reaction_type || null);
      }
    } catch (err) {
      console.error("Failed to fetch reactions", err);
    }
  };

  const handlePostReaction = async (type: string) => {
    if (!decoded?.email) {
      alert("Please log in to react.");
      return;
    }

    try {
      await axios.put("/api/admin/comments/reactions", {
        post_id: postId,
        user_email: decoded.email,
        reaction_type: type,
      });
      fetchPostReactions();
    } catch (err) {
      console.error("Failed to submit reaction", err);
    }
  };

  const handleCopy = (event: ClipboardEvent) => {
    event.preventDefault();
    const customText =
      "For more details on this content, visit the Race Auto India website.";
    if (event.clipboardData) {
      event.clipboardData.setData("text", customText);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/admin/comments?post_id=${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 300 * 1024) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload an image smaller than 300KB");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || (!decoded && !email)) {
      alert("Please enter a comment and valid email");
      return;
    }

    const emailToCheck = decoded?.email || email.trim();

    setLoading(true);
    const formData = new FormData();
    formData.append("comment", sanitizeComment(comment));
    formData.append("email", emailToCheck);
    formData.append("post_id", postId.toString());
    if (image) formData.append("image", image);

    try {
      await axios.post("/api/admin/comments", formData);
      setComment("");
      setEmail("");
      setImage(null);
      setImagePreviewUrl(null);
      fetchComments();
    } catch (err) {
      console.error("Comment submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditedComment(comments[index].comment);
  };

  const handleEditSave = async (commentId: number) => {
    try {
      await axios.put("/api/admin/comments", {
        id: commentId,
        comment: sanitizeComment(editedComment),
      });
      setEditingIndex(null);
      setEditedComment("");
      fetchComments();
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 5);

  return (
    <>
      {/* Reactions UI */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop:'10px',
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {["like", "dislike", "angry", "sad", "wow"].map((type) => (
          <button
            key={type}
            onClick={() => handlePostReaction(type)}
            style={{
              background: userPostReaction === type ? "#007bff" : "#f0f0f0",
              color: userPostReaction === type ? "#fff" : "#000",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {type === "like" && "👍"}
            {type === "dislike" && "👎"}
            {type === "angry" && "😡"}
            {type === "sad" && "😢"}
            {type === "wow" && "😮"} {postReactions[type] || 0}
          </button>
        ))}
      </div>
       <span
                style={{ borderBottom:'1px solid black'  }}
                className="m-0 mb-2 p-0 text-center"
              >
                Advertisement

              </span>

        {/* Desktop Banner (3.56:1) */}
        <div
          className="position-relative my-2 d-none d-md-block"
          style={{ width: "100%", aspectRatio: "3.56/1" }}
        >
          <Link href="/subscription" passHref>
            <Image
              src="/images/SUBCRIBE BANNER.jpg"
              alt="Subscribe – desktop"
              fill
              style={{ objectFit: "cover" }}
              sizes="(min-width: 768px) 100vw"
              quality={75}
              priority
            />
          </Link>
        </div>
      {/* Main content */}
      <div
        style={{
          userSelect: "text",
          maxHeight: shouldLimitContent ? "200px" : "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{ opacity: shouldLimitContent ? 0.7 : 1 }}
          dangerouslySetInnerHTML={{
            __html: shouldLimitContent
              ? content.slice(0, 1000) + "..."
              : content,
          }}
        />
      </div>

      {shouldLimitContent && (
        <div style={{ textAlign: "center", padding: "20px", marginTop: "5px" }}>
          <h3 style={{ fontWeight: "bold" }}>
            Please Log In to Access the Full Article
          </h3>
          <button
            onClick={() => setShowAuth(true)}
            style={{
              background: "#007bff",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
            }}
          >
            Log In
          </button>
        </div>
      )}

      {/* Comment input */}
      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #ddd",
          paddingTop: "20px",
        }}
      >
        <h4>Leave a Comment</h4>
        {!decoded && (
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
          />
        )}
        <textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        ></textarea>

        {/* Styled image upload */}
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            cursor: "pointer",
            color: "#007bff",
          }}
        >
          Upload Image (Max 300KB):
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="preview"
            style={{ maxHeight: "100px", marginBottom: "10px" }}
          />
        )}

        <button
          onClick={handleCommentSubmit}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            borderRadius: "6px",
          }}
        >
          {loading ? "Submitting..." : "Submit Comment"}
        </button>
      </div>

      {/* Comment list */}
      <div style={{ marginTop: "30px" }}>
        <h4>Comments</h4>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <>
            {displayedComments.map((c, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                <strong>{c.email}</strong>
                {editingIndex === i ? (
                  <>
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      style={{ width: "100%", marginBottom: "5px" }}
                    />
                    <button
                      onClick={() => handleEditSave(c.id)}
                      style={{
                        background: "green",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        marginRight: "5px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      style={{
                        background: "#ccc",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{sanitizeComment(c.comment)}</p>
                    {c.image_url && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${c.image_url}`}
                        alt="uploaded"
                        style={{
                          maxWidth: "100px",
                          cursor: "zoom-in",
                          borderRadius: "4px",
                        }}
                        onClick={() =>
                          setModalImageUrl(
                            `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${c.image_url}`
                          )
                        }
                      />
                    )}
                    {decoded?.email === c.email && (
                      <button
                        onClick={() => handleEditStart(i)}
                        style={{
                          marginTop: "5px",
                          background: "transparent",
                          color: "#007bff",
                          border: "none",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
            {comments.length > 5 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                style={{
                  marginTop: "10px",
                  background: "transparent",
                  color: "#007bff",
                  border: "none",
                }}
              >
                {showAllComments
                  ? "Hide comments"
                  : `View ${comments.length - 5} more comment${
                      comments.length - 5 > 1 ? "s" : ""
                    }`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Image modal */}
      {modalImageUrl && (
        <div
          onClick={() => setModalImageUrl(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={modalImageUrl}
            alt="Zoomed"
            style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "8px" }}
          />
        </div>
      )}

      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default PostContent;
