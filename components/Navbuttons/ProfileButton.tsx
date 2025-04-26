"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

const ProfileButton = ({ token }: { token: string }) => {
  const decoded: any = jwtDecode(token);
  const router = useRouter();
  const signoutapi = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/signout`);

      toast.success("Sign out success", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <DropdownButton
      variant="secondary"
      id="dropdown-basic-button"
      drop="down" 
      align="start"
      className="ms-auto"
      title={<FaUser />}
    >
      <Dropdown.Item onClick={() => router.push("/profile")}>
        Profile
      </Dropdown.Item>
      {(decoded.role == "admin" ||
        decoded.role == "ad team" ||
        decoded.role == "moderator") && (
        <Dropdown.Item onClick={() => router.push("/admin")}>
          Admin
        </Dropdown.Item>
      )}

      <Dropdown.Item onClick={signoutapi}>Sign Out</Dropdown.Item>
    </DropdownButton>
  );
};

export default ProfileButton;
