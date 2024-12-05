"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Edit_Market = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [show_on_menu, setShow_on_menu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState("");

  const formDataApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.BACKEND_URL}api/admin/market/${id}`
      );
      setTitle(res.data[0].title);

      setColor(res.data[0].color);

      setShow_on_menu(res.data[0].show_on_menu === 1);
    } catch (err) {
      console.log(err);
    }
  };
  const EditApi = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(
        `${process.env.BACKEND_URL}api/admin/market/${id}`,
        {
          title,
          color,
          show_on_menu,
        }
      );
      toast.success("Category updated!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log(err);
      toast.warn(
        "An error occurred while submitting the form. Please try again later.",
        {
          position: "top-right",
          autoClose: 5000,
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
    formDataApi();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    EditApi();
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        
        <div className="shadow-sm p-3 mb-5  mt-5 bg-white rounded border-0">
        <Link href='/admin/market'><button className="btn btn-secondary mb-3">Back</button></Link>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="color" className="form-label">
                Color
              </label>
              <input
                type="color"
                className="form-control"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="show_on_menu"
                checked={show_on_menu}
                onChange={(e) => setShow_on_menu(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="show_on_menu">
                Show on Menu
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updated" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit_Market;
