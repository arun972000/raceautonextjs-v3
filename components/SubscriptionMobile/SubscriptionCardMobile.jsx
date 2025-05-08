'use client';
import React, { useEffect, useState } from "react";
import { PiCheckCircleFill, PiXCircleFill } from "react-icons/pi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './styles/subscriptionMobileCard.css';
import SubscriptionForm from "@/app/subscription/component/subscription-v2/SubscriptionForm";

export default function MobilePricingCard({
  title,
  subtitle,
  price,
  features,
  color,
  icon,
  isPopular,
  currency,
  isYear
}) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [subcriptionData, setSubcriptionData] = useState([]);

  const subscriptionApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/purchase/${email}`
      );
      setSubcriptionData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setToken(token);
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    }
  }, []);

  useEffect(() => {
    if (email !== "") {
      subscriptionApi();
    }
  }, [email]);

  const isActivePlan = subcriptionData.length !== 0 &&
    subcriptionData[0].plan_name === title.toLowerCase() &&
    subcriptionData[0].status === "Active";

  // Image paths
  const imageSrc = {
    gold: "/images/gold-star.png",
    silver: "/images/silver.jpg",
    platinum: "/images/platinum.png"
  };

  return (
    <div
      className={`mobile-pricing-card ${isActivePlan ? "active-plan" : ""}`}
      style={{ backgroundColor: color, position: 'relative' }}
    >
      {isPopular && <div className="popular-badge">Popular</div>}
      {isActivePlan && (
        <div className="active-badge animate-pulse">Your Plan</div>
      )}

      {/* Conditional image rendering */}
      {["gold", "silver", "platinum"].includes(title.toLowerCase()) && (
        <img
          src={imageSrc[title.toLowerCase()]}
          alt={`${title} Plan`}
          className="corner-icon"
        />
      )}

      <h3 className="plan-title" style={{ color: 'black' }}>{title}</h3>
      <p className="plan-subtitle" style={{ color: 'black' }}>{subtitle}</p>

      <h2 className="plan-price" style={{ color: 'black' }}>
        {typeof price === "number"
          ? price.toLocaleString("en-US", {
            style: "currency",
            currency: currency || "INR",
          })
          : "N/A"}
        <span>/{isYear ? "yr" : "mo"}</span>
      </h2>

      <ul className="feature-list">
        {features.map((f, i) => (
          <li key={i} className={!f.available ? "unavailable" : ""} style={{ color: 'black' }}>
            {f.available
              ? <PiCheckCircleFill className="icon text-success" />
              : <PiXCircleFill className="icon text-muted" />}
            {f.plan}
          </li>
        ))}
      </ul>

      {!isActivePlan && (
        <SubscriptionForm plan={title.toLowerCase()} />
      )}
    </div>
  );
}
