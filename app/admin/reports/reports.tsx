"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";

const ReportsForm = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState<any>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile && selectedFile.size <= maxSize) {
      setImageUrl(selectedFile);
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      alert("Please select a file smaller than 5MB.");
      e.target.value = null;
    }
  };

  const fetchReportsData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/reports`
      );
      setTitle(res.data[0].title);
      setSummary(res.data[0].summary);
      setPreview(
        `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${res.data[0].image_url}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !summary) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("image_url", imageUrl);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/reports`,
        formData
      );
      toast.success("Updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      toast.warn(
        "An error occurred while submitting the form. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  return (
    <div className="col-12">
      <div className="shadow-sm p-3 mb-5 mt-5 bg-white rounded border-0">
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSummary" className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
               as="textarea"
              placeholder="Enter summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </Form.Group>
          {imageUrl && (
            <Image
              src={preview}
              alt="Preview image"
              className="my-3"
              height={200}
              width={420}
            />
          )}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ReportsForm;
