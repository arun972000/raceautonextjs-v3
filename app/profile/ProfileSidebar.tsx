"use client";
import Link from "next/link";
import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import {
  FaUserCircle,
  FaUser,
  FaBook,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaPen,
} from "react-icons/fa";
import { HiBellAlert } from "react-icons/hi2";

function ProfileCard() {
  return (
    <Card style={{ borderRadius: "1rem" }} className="text-center shadow mb-3">
      <Card.Body>
        <div style={{ position: "relative", display: "inline-block" }}>
          <FaUserCircle size={200} color="#ccc" />
        </div>
      </Card.Body>
      <ListGroup variant="flush" className="text-start">
        <Link href="/profile">
          <ListGroup.Item action>
            <FaUser className="me-2 my-3" /> My Profile
          </ListGroup.Item>
        </Link>
        {/* <Link href="/magazine">
          <ListGroup.Item action>
            <FaBook className="me-2 my-3" /> Magazine
          </ListGroup.Item>
        </Link> */}
        <Link href="/profile/support">
          <ListGroup.Item action>
            <FaQuestionCircle className="me-2 my-3" /> Help & Support
          </ListGroup.Item>
        </Link>
        <Link href="/profile/subscription">
          <ListGroup.Item action>
            <HiBellAlert className="me-2 my-3" /> Subscribe
          </ListGroup.Item>
        </Link>
        <Link href="/user/settings">
          <ListGroup.Item action>
            <FaCog className="me-2 my-3" /> Account Setting
          </ListGroup.Item>
        </Link>
      </ListGroup>
    </Card>
  );
}

export default ProfileCard;
