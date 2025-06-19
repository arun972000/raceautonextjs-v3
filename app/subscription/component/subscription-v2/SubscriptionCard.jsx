'use client';
import React, { useEffect, useState } from "react";
import "./subscriptioncards.css";
import { PiCheckCircleFill, PiXCircleFill } from "react-icons/pi";
import SubscriptionForm from "./SubscriptionForm";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './subscriptioncard.css';

export default function PricingCard({
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

  return (
    <div
      className={`pricing-card ${isActivePlan ? "active-plan" : ""}`}
      style={{ backgroundColor: color, position: 'relative' }}
    >
      {/* "50% OFF" animated label */}
      {typeof price === 'number' &&
        (title.toLowerCase() === "gold" || title.toLowerCase() === "platinum") && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            70% OFF
          </span>
        )}

      {isPopular && <div className="popular-badge">Popular</div>}

      {isActivePlan && (
        <div className="active-badge animate-pulse">Your Plan</div>
      )}

      {title.toLowerCase() === "gold" && (
        <img src="/images/gold-star.png" alt="Gold Icon" className="corner-icon" />
      )}
      {title.toLowerCase() === "silver" && (
        <img src="/images/silver.jpg" alt="Silver Icon" className="corner-icon" />
      )}
      {title.toLowerCase() === "platinum" && (
        <img src="/images/platinum.png" alt="Platinum Icon" className="corner-icon" />
      )}
      <h3 className="plan-title" style={{ color: 'black' }}>{title}</h3>
      <p className="plan-subtitle">{subtitle}</p>

      <div className="price-section" style={{ textAlign: "center" }}>
        {(title.toLowerCase() === "platinum" || title.toLowerCase() === "gold") && typeof price === "number" && (
          <div
            className="fake-price"
            style={{
              position: 'relative',
              display: 'inline-block',
              fontSize: '1.1rem',
              color: '#888',
              marginBottom: '4px',
              fontWeight: 500
            }}
          >
            {(price / 0.3).toLocaleString("en-US", {
              style: "currency",
              currency: currency || "INR",
            })}
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                width: '100%',
                height: '1px',
                backgroundColor: 'red',
                transform: 'rotate(-5deg)',
                content: '""',
              }}
            />
          </div>
        )}

        {title.toLowerCase() === "silver" && (
          <div
            style={{
              background: "linear-gradient(135deg, #f0faff, #dbefff)",
              padding: "14px 18px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#004b8d",
                letterSpacing: "0.6px",
                marginBottom: "4px",
              }}
            >
              Limited-Time Offer!
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#2c3e50",
                opacity: 0.85,
              }}
            >
              ⏳ Hurry, offer ends this month!
            </div>
          </div>
        )}

        <h2 className="plan-price" style={{ color: 'black' }}>
          {typeof price === "number"
            ? price.toLocaleString("en-US", {
              style: "currency",
              currency: currency || "INR",
            })
            : "N/A"}
          <span>/{isYear ? "yr" : "mo"}</span>
        </h2>
      </div>

      <ul className="feature-list">
        {features
          .slice() // make a copy to avoid mutating original
          .sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1))
          .map((f, i) => (
            <li key={i} className={!f.available && "unavailable"} style={{ color: 'black' }}>
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
