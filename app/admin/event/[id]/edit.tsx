/* eslint-disable react/no-unescaped-entities */
"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FaFileImage } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const EventEdit = () => {
  const { id } = useParams();
  const categories = [
    { id: 1, name: "Car", image: "/images/car.png" },
    { id: 2, name: "Bike", image: "/images/bike.png" },
    { id: 3, name: "CV", image: "/images/truck.png" },
    { id: 4, name: "Farming", image: "/images/agri.png" },
    { id: 5, name: "C & M", image: "/images/CM.png" },
    { id: 6, name: "Components", image: "/images/components.jpg" },
  ];


  const regions = [
    { id: 1, name: "National" },
    { id: 2, name: "International" },
  ];

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [image_url, setImage_url] = useState<any>([]);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const focusedStyle = { borderColor: "#2196f3" };
  const acceptStyle = { borderColor: "#00e676" };
  const rejectStyle = { borderColor: "#ff1744" };

  const onDrop = useCallback((acceptedFiles: any) => {
    setImage_url(acceptedFiles[0]);
    setIsFileSelected(true);
    setPreview(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop,
    });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const eventData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/event/${id}`
      );
      const event = res.data[0];
      setTitle(event.title);
      setSummary(event.summary);
      setLocation(event.location);
      setReferenceLink(event.referenceLink);
      setSelectedCategory(event.category)
      setSelectedRegion(event.region)
      setStartDate(new Date(event.start_date).toISOString().split("T")[0]);
      setEndDate(new Date(event.end_date).toISOString().split("T")[0]);
      setPreview(`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${event.image_url}`);
    } catch (err) {
      console.error("Failed to fetch event data", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("start_date", start_date);
    formData.append("end_date", end_date);
    formData.append("location", location);
    formData.append("referenceLink", referenceLink);
    formData.append("image_url", image_url);
    formData.append("category", selectedCategory?.toString() || "");
    formData.append("region", selectedRegion?.toString() || "");
    
    setIsSubmitting(true);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/event/${id}`,
        formData
      );
      toast.success("Event updated!", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
    } catch (err) {
      toast.warn(
        "An error occurred while submitting the form. Please try again later.",
        {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        }
      );
      console.error("Error updating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCategoryChange = (value: number | null) => {
    setSelectedCategory(value);
  };

  const handleRegionChange = (value: number | null) => {
    setSelectedRegion(value);
  };

  useEffect(() => {
    eventData();
  }, []);

  return (
    <div className="col-12">
      <div className="shadow-sm p-3 mb-5 mt-5 bg-white rounded border-0">
        <Link href="/admin/event">
          <button className="btn btn-secondary my-3">Back</button>
        </Link>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Form onSubmit={handleSubmit}>
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
                  type="text"
                  placeholder="Enter summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="mb-3">
              <select
                className="form-select mb-2"
                onChange={(e) =>
                  handleCategoryChange(parseInt(e.target.value) || null)
                }
                value={selectedCategory || ""}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <select
              className="form-select mb-3"
              onChange={(e) =>
                handleRegionChange(parseInt(e.target.value) || null)
              }
              value={selectedRegion || ""}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
              <Form.Group controlId="formStartDate" className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={start_date}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formEndDate" className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={end_date}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formLocation" className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formReferenceLink" className="mb-3">
                <Form.Label>Reference Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Reference Link"
                  value={referenceLink}
                  onChange={(e) => setReferenceLink(e.target.value)}
                  required
                />
              </Form.Group>

              {preview && (
                <Image
                  src={preview}
                  alt="Banner Preview"
                  className="my-3"
                  height={200}
                  width={200}
                />
              )}

              <Form.Group controlId="formImage_url" className="mb-3">
                <Form.Label>Select Image</Form.Label>
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  {isFileSelected ? (
                    <p>Image file selected</p>
                  ) : (
                    <div className="text-center">
                      <FaFileImage className="mb-3" style={{ fontSize: 35 }} />
                      <p>
                        Drag 'n' drop image files here, or click to select
                      </p>
                    </div>
                  )}
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Submit"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEdit;
