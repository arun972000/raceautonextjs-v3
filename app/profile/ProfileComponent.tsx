/* eslint-disable react/no-unescaped-entities */
"use client";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin, FaPen } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { formatDate } from "@/components/Time";

function ProfileDashboard({ token }: { token: string }) {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [aboutme, setAboutme] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [subscription, setSubscription] = useState([]);
  const [subscriptionPack, setSubscriptionPack] = useState<any>([]);
  const [plan, setPlan] = useState([]);

  const subscriptionApi = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription`
    );
    setSubscription(res.data);
  };

  const packApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/profile/subscription/${decoded.email}`
      );
      setSubscriptionPack(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const currentPlan =
    subscriptionPack.length === 0 || subscriptionPack[0]?.status === "expired"
      ? "bronze"
      : subscriptionPack[0]?.plan_name;
  const isActive = subscriptionPack[0]?.status === "Active";
  const isExpired = subscriptionPack[0]?.status === "expired";

  // Dynamic class assignment based on the current plan
  const planClass = (plan: string) => {
    switch (plan) {
      case "bronze":
        return "text-warning";
      case "silver":
        return "text-secondary";
      case "gold":
        return "text-success";
      case "platinum":
        return "text-primary";
      default:
        return "text-muted";
    }
  };

  const decoded: any = token
    ? jwtDecode(token)
    : { email: "test@gmail.com", role: "user" };
  const userInfo = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/profile/${decoded.email}`
      );
      setData(res.data);
      setEmail(res.data[0].email || "");
      setName(res.data[0].username || "");
      setAboutme(res.data[0].about_me || "");
      setInstagram(res.data[0].instagram_url || "");
      setFacebook(res.data[0].facebook_url || "");
      setLinkedin(res.data[0].linkedin_url || "");
      setTwitter(res.data[0].twitter_url || "");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userInfo();
  }, []);

  useEffect(() => {
    subscriptionApi();
    packApi();
  }, []);

  useEffect(() => {
    if (subscription.length !== 0) {
      const planName =
        subscriptionPack.length === 0 ||
        subscriptionPack[0]?.status === "expired"
          ? "bronze"
          : subscriptionPack[0]?.plan_name;
      const filteredPlan = subscription.filter(
        (item: any) => item[planName] === 1
      );
      setPlan(filteredPlan);
    }
  }, [subscriptionPack, subscription]);
  return (
    <Row className="">
      {/* Subscription Card */}
      <Col md={6} className="mb-3 mb-lg-0">
        <Card className="p-3 shadow-sm rounded-3">
          <Card.Body>
            <Card.Title className="text-center">Subscription</Card.Title>
            {isExpired ? (
              <Card.Text className="text-danger">
                Your plan has expired. Showing Bronze plan details.
              </Card.Text>
            ) : (
              <>
                <div className="text-center">
                  <Card.Text>
                    You are currently on the{" "}
                    <span className={planClass(currentPlan)}>
                      {currentPlan}
                    </span>{" "}
                    plan now.
                  </Card.Text>
                  <Card.Title className="text-center mt-3">
                    Validity
                  </Card.Title>
                  <Card.Text>
                    Start Date: {formatDate(subscriptionPack[0]?.start_date)}
                  </Card.Text>
                  <Card.Text>
                    End Date: {formatDate(subscriptionPack[0]?.end_date)}
                  </Card.Text>
                </div>
                {/* <div className="d-flex justify-content-center">
                  <Button variant="outline-secondary" className="px-4">
                    Free
                  </Button>
                </div> */}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Plan Subscription & Validity Card */}
      <Col md={6} className="mb-3 mb-lg-0">
        <Card className="p-3 shadow-sm rounded-3">
          <Card.Body>
          <Card.Title className="text-center mt-3">
                    Plan Details
                  </Card.Title>
            {plan.map((item: any, i) => (
              <li key={i} className="py-1">
                {item.plan}
              </li>
            ))}
          </Card.Body>
        </Card>
      </Col>

      {/* Profile Card */}
      <Col md={6} className="mb-3 mb-lg-0">
        <Card className="p-3 shadow-sm rounded-3">
          <Card.Body>
            <Card.Title className="text-center">Profile</Card.Title>
            <Form>
              <div className="d-flex align-items-center my-3">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  disabled
                  value={name}
                  className="me-2"
                />

                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
              <div className="d-flex align-items-center my-3">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  disabled
                  value={email}
                  className="me-2"
                />
                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
              <div className="d-flex align-items-center my-3">
                <Form.Control
                  type="text"
                  placeholder="About Me"
                  disabled
                  value={aboutme}
                  className="me-2"
                />
                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* Social Media Card */}
      <Col md={6} className="mt-3">
        <Card className="p-3 shadow-sm rounded-3">
          <Card.Body className="">
            <Card.Title className="text-center">Social Media</Card.Title>
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center my-2">
                <FaFacebook size={24} className="me-2" />{" "}
                <Form.Control
                  type="text"
                  placeholder="Facebook URL"
                  disabled
                  value={facebook}
                  className="me-2"
                />{" "}
                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
              <div className="d-flex align-items-center my-2">
                <FaInstagram size={24} className="me-2" />{" "}
                <Form.Control
                  type="text"
                  placeholder="instagram URL"
                  value={instagram}
                  disabled
                  className="me-2"
                />{" "}
                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
              <div className="d-flex align-items-center my-2">
                <FaXTwitter size={24} className="me-2" />{" "}
                <Form.Control
                  type="text"
                  placeholder="Twitter URL"
                  disabled
                  value={twitter}
                  className="me-2"
                />{" "}
                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
              <div className="d-flex align-items-center my-2">
                <FaLinkedin size={24} className="me-2" />{" "}
                <Form.Control
                  type="text"
                  placeholder="Linkedin URL"
                  disabled
                  value={linkedin}
                  className="me-2"
                />{" "}
                <Link href="/user/settings">
                  <FaPen className="text-muted" style={{ cursor: "pointer" }} />
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default ProfileDashboard;
