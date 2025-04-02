/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SubscriptionType } from "@/types/subscription";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import "./subscription.css";
import { FaMedal } from "react-icons/fa";
import Link from "next/link";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "@/firebase";

const SubscriptionModal = ({
  show,
  handleClose,
  plan,
  planPricing,
  duration,
  email,
}
) => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // To store the timer ID so we can clear it if needed
  const resendTimerRef = useRef(null);


  const handleCountryCodeChange = (e) => setCountryCode(e.target.value);

  const handlePhoneChange = (e) => setPhoneNumber(e.target.value);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };



  const phoneDataApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/auth/phone/${email}`
      );
      setPhoneNumber(res.data[0].phone_number);
      const verified = res.data[0].phone_status == 1;
      setVerifiedOtp(verified);
      setIsVerified(verified);
    } catch (err) {
      console.log(err);
    }
  };

  const verifyOTP = async () => {

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/auth/phone/${email}`,
        { phone: `${countryCode} ${phoneNumber}` }
      );
      setVerifiedOtp(true)
      toast.success("Phone verified successfully!");
    } catch (error) {
      setMessage("Invalid OTP, try again.");
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (email === "") {
      toast.warn("Sign in to unlock your purchase!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return router.push("/login");
    }

    if (!phoneNumber) {
      return toast.warn(
        "You must verify your phone number before proceeding to payment.",
        {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
    }

    if (!isChecked) {
      return toast.warn(
        "Before purchasing our product, you must acknowledge and agree to our terms and conditions by selecting the checkbox.",
        {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/create-payment`,
        {
          customer_email: email,
          AMT: planPricing,
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Public Key
        amount: planPricing * 100,
        currency: "INR",
        name: "Race auto india",
        order_id: data.id,

        handler: async function (response) {
          const verifyRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/verify-payment`,
            {
              ...response,
              email: email,
              plan,
              duration,
            }
          );
          if (verifyRes.data.success) {

            const result = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/transactional-email`, { email, plan, duration })
            router.push(
              `/subscription/payment-success?plan=${plan}&duration=${duration}`
            );
          } else {
            router.push(
              `/subscription/payment-failure?plan=${plan}&duration=${duration}`
            );
          }
        },
        prefill: { email: email },
        theme: { color: "#3399cc" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Subscription Error:", error);
    }
  };

  useEffect(() => {
    phoneDataApi();
    // Cleanup the timer when the component unmounts
  }, []);



  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
      {/* Modal Header with Gradient Background */}
      <Modal.Header
        closeButton
        className={`modal-header-custom ${plan.toLowerCase()}-gradient`}
      >
        <Modal.Title className="d-flex align-items-center">
          <span className={`plan-badge ${plan.toLowerCase()}`}>
            <FaMedal />
          </span>
          <span className="ms-2">{plan.toUpperCase()} PLAN</span>
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>
        <p className="text-muted">
          Unlock all exclusive <strong>{plan}</strong> plan features after
          purchasing.
        </p>

        <div className="price-section">
          <strong>Price: </strong>
          <span className="price-badge">₹{planPricing}</span>
        </div>

        {/* Form Section */}
        <Form>
          <Form.Group className="mt-2 mb-3">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              value={email}
              required
              disabled
              className="custom-input"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <div style={{ display: "flex", gap: "8px" }}>
              <Form.Select
                value={countryCode}
                onChange={handleCountryCodeChange}
                className="custom-input"
                style={{ maxWidth: "100px" }}
                disabled={verifiedOtp}
              >
                {["+91", "+1"].map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
                disabled={verifiedOtp}
                className="custom-input"
                placeholder="Enter phone number"
              />
            </div>
          </Form.Group>
          {!verifiedOtp && (
            <>
              <div className="text-center my-2">
                <Button
                  onClick={verifyOTP}
                  disabled={!phoneNumber}
                  className="btn btn-success"
                >
                  Verify
                </Button>
              </div>
            </>
          )}
          {message && (
            <p className="text-center text-muted mt-2">{message}</p>
          )}
          {isVerified && (
            <p className="info-text">
              Your email ID and phone number are retrieved from your login
              information
            </p>
          )}

          <Form.Group className="mb-3">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Form.Check
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                required
                className="checkbox-custom"
              />
              <Form.Label style={{ margin: 0 }}>
                I agree to the{" "}
                <Link href="/terms-conditions" className="text-primary">terms and conditions</Link>{" "}
                regarding this purchase
              </Form.Label>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          className="btn-cancel"
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="btn-buy">
          Proceed to Payment
        </Button>
      </Modal.Footer>

    </Modal>
  );
};



const SubscriptionCard = ({ data, token }) => {
  const router = useRouter();
  const [currency, setCurrency] = useState("INR");
  const [isYear, setIsYear] = useState(false);
  const [subcriptionData, setSubcriptionData] = useState([]);
  const decoded = token ? jwtDecode(token) : { email: "" };

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const sectionRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const [planPricing, setPlanPricing] = useState(null);

  // Fetch subscription data for current user
  const subscriptionApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/purchase/${decoded.email}`
      );
      setSubcriptionData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Format large numbers
  function formatNumber(num) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + "Cr";
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + "L";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  }

  // Filter pricing data
  const platinumPlan = data.filter((item) => item.platinum === 1);
  const goldPlan = data.filter((item) => item.gold === 1);
  const silverPlan = data.filter((item) => item.silver === 1);
  const bronzePlan = data.filter((item) => item.bronze === 1);

  const MonthlyPrice = data.filter((item) => item.plan === "Monthly price");
  const AnnualPrice = data.filter((item) => item.plan === "Annual price");
  // Assume data for usd conversion is provided with plan === "usd"
  const usdValueArray = data.filter((item) => item.plan === "usd");
  // Use a common conversion rate from the usdValueArray (for example, platinum rate conversion)
  const usdValue = usdValueArray[0]?.platinum || 1;

  // Helper: Get price based on plan key ("bronze", "silver", etc.)
  const getPrice = (planKey) => {
    // Get INR price
    const priceINR = !isYear
      ? MonthlyPrice[0]?.[planKey] || 0
      : AnnualPrice[0]?.[planKey] || 0;
    // If USD is selected, convert INR price to USD using usdValue variable (divide)
    if (currency === "USD") {
      return (priceINR / usdValue).toFixed(2);
    }
    return priceINR;
  };

  // Helper: Get saving calculation (only for INR, assuming saving is difference between monthly*12 and annual)
  const getSaving = (planKey) => {
    if (currency === "INR") {
      const monthly = MonthlyPrice[0]?.[planKey] || 0;
      const annual = AnnualPrice[0]?.[planKey] || 0;
      return monthly * 12 - annual;
    }
    return 0;
  };

  const handleShow = (pricing, plan, duration) => {
    if (decoded.email === "") {
      toast.warn("Sign in to unlock your purchase!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return router.push("/login");
    }
    setSelectedPlan(plan);
    setShowModal(true);
    setPlanPricing(pricing);
    setDuration(duration);
  };

  const handleClose = () => setShowModal(false);

  const handleSubscription = async (AMT, plan, duration) => {
    if (decoded.email === "") {
      toast.warn("Sign in to unlock your purchase!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return router.push("/login");
    }

    try {
      const { data: paymentData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/create-payment`,
        {
          customer_email: decoded.email,
          AMT,
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMT * 100,
        currency: "INR",
        name: "Race auto india",
        order_id: paymentData.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/verify-payment`,
            {
              ...response,
              email: decoded.email,
              plan,
              duration,
            }
          );
          if (verifyRes.data.success) {
            router.push(
              `/subscription/payment-success?plan=${plan}&duration=${duration}`
            );
          } else {
            router.push(
              `/subscription/payment-failure?plan=${plan}&duration=${duration}`
            );
          }
        },
        prefill: { email: decoded.email },
        theme: { color: "#3399cc" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Subscription Error:", error);
    }
  };

  useEffect(() => {
    if (decoded.email !== "") {
      subscriptionApi();
    }
  }, []);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <>
      {selectedPlan && (
        <SubscriptionModal
          show={showModal}
          handleClose={handleClose}
          plan={selectedPlan}
          email={decoded.email}
          duration={duration}
          planPricing={planPricing}
        />
      )}
      <div id="recaptcha-container" className="mt-3"></div>
      <div className={`row justify-content-center`}>
        <div className="col-md-8 text-center" ref={sectionRef}>
          <h2 className="mt-3 font-weight-medium mb-1 text-primary">
            Grow better with the right plan
          </h2>
          <h6 className="subtitle">We offer 100% satisfaction</h6>
          <div className="switcher-box mt-4 d-flex align-items-center justify-content-center"></div>
          <div className="btn-group">
            {/* Currency toggle buttons */}
            <button
              type="button"
              className={`btn ${currency === "INR" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setCurrency("INR")}
            >
              INR
            </button>
            <button
              type="button"
              className={`btn ${currency === "USD" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setCurrency("USD")}
            >
              USD
            </button>
            {/* Duration toggle */}
            <button
              type="button"
              className={`btn ${!isYear ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setIsYear(false)}
            >
              Month
            </button>
            <button
              type="button"
              className={`btn ${isYear ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setIsYear(true)}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {/* Bronze Card */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover border-0 mb-4">
            <div className="card-body font-14">
              {subcriptionData[0]?.plan_name === "bronze" &&
                subcriptionData[0]?.status === "Active" && (
                  <span className="badge bg-info">Current plan</span>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">BRONZE</h5>
              <h6 className="subtitle font-weight-normal">
                For Small Businesses & Startups
              </h6>
              <div className="pricing my-3">
                <sup>{currency === "INR" ? "₹" : "$"}</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {getPrice("bronze")}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {currency === "INR"
                    ? formatNumber(getPrice("bronze"))
                    : getPrice("bronze")}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                {isYear && currency === "INR" && (
                  <span className="d-block">
                    Save{" "}
                    <span className="font-weight-medium text-warning">
                      ₹{formatNumber(getSaving("bronze"))}
                    </span>{" "}
                    a Year
                  </span>
                )}
              </div>
              <ul className="text-start pl-2">
                {bronzePlan.map((item, i) => (
                  <li key={i} className="py-1">
                    {item.plan}
                  </li>
                ))}
                <li className="d-block py-1">&nbsp;</li>
              </ul>
              {subcriptionData.length !== 0 &&
                subcriptionData[0].status === "Active" ? null : (
                <div className="bottom-btn">
                  <button
                    className="btn btn-primary-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        getPrice("bronze"),
                        "bronze",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Silver Card */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover border-0 mb-4">
            <div className="card-body font-14">
              {subcriptionData[0]?.plan_name === "silver" &&
                subcriptionData[0]?.status === "Active" && (
                  <span className="badge bg-info">Current plan</span>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">SILVER</h5>
              <h6 className="subtitle font-weight-normal">
                For Growing Businesses
              </h6>
              <div className="pricing my-3">
                <sup>{currency === "INR" ? "₹" : "$"}</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {getPrice("silver")}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {currency === "INR"
                    ? formatNumber(getPrice("silver"))
                    : getPrice("silver")}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                {isYear && currency === "INR" && (
                  <span className="d-block">
                    Save{" "}
                    <span className="font-weight-medium text-warning">
                      ₹{formatNumber(getSaving("silver"))}
                    </span>{" "}
                    a Year
                  </span>
                )}
              </div>
              <ul className="text-start pl-2">
                {silverPlan.map((item, i) => (
                  <li key={i} className="py-1">
                    {item.plan}
                  </li>
                ))}
                <li className="d-block py-1">&nbsp;</li>
              </ul>
              {subcriptionData.length !== 0 &&
                subcriptionData[0].status === "Active" ? null : (
                <div className="bottom-btn">
                  <button
                    className="btn btn-danger-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        getPrice("silver"),
                        "silver",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gold Card */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover border-0 mb-4">
            <div className="card-body font-14">
              {subcriptionData[0]?.plan_name === "gold" &&
                subcriptionData[0]?.status === "Active" && (
                  <span className="badge bg-info">Current plan</span>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">GOLD</h5>
              <h6 className="subtitle font-weight-normal">
                For Expanding Enterprises
              </h6>
              <div className="pricing my-3">
                <sup>{currency === "INR" ? "₹" : "$"}</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {getPrice("gold")}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {currency === "INR"
                    ? formatNumber(getPrice("gold"))
                    : getPrice("gold")}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                {isYear && currency === "INR" && (
                  <span className="d-block">
                    Save{" "}
                    <span className="font-weight-medium text-warning">
                      ₹{formatNumber(getSaving("gold"))}
                    </span>{" "}
                    a Year
                  </span>
                )}
              </div>
              <ul className="text-start pl-2">
                {goldPlan.map((item, i) => (
                  <li key={i} className="py-1">
                    {item.plan}
                  </li>
                ))}
                <li className="d-block py-1">&nbsp;</li>
              </ul>
              {subcriptionData.length !== 0 &&
                subcriptionData[0].status === "Active" ? null : (
                <div className="bottom-btn">
                  <button
                    className="btn btn-warning-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        getPrice("gold"),
                        "gold",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platinum Card */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover mb-4 border border-success">
            <div className="card-body font-14">
              <span
                className="badge badge-inverse p-2 position-absolute price-badge font-weight-normal bg-success"
                style={{ color: "white" }}
              >
                Popular
              </span>
              {subcriptionData[0]?.plan_name === "platinum" &&
                subcriptionData[0]?.status === "Active" && (
                  <span className="badge bg-info">Current plan</span>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">PLATINUM</h5>
              <h6 className="subtitle font-weight-normal">
                For Large Corporations
              </h6>
              <div className="pricing my-3">
                <sup>{currency === "INR" ? "₹" : "$"}</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {getPrice("platinum")}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {currency === "INR"
                    ? formatNumber(getPrice("platinum"))
                    : getPrice("platinum")}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                {isYear && currency === "INR" && (
                  <span className="d-block">
                    Save{" "}
                    <span className="font-weight-medium text-warning">
                      ₹{formatNumber(getSaving("platinum"))}
                    </span>{" "}
                    a Year
                  </span>
                )}
              </div>
              <ul className="text-start pl-2">
                {platinumPlan.map((item, i) => (
                  <li key={i} className="py-1">
                    {item.plan}
                  </li>
                ))}
                <li className="d-block py-1">&nbsp;</li>
              </ul>
              {subcriptionData.length !== 0 &&
                subcriptionData[0].status === "Active" ? null : (
                <div className="bottom-btn">
                  <button
                    className="btn btn-success-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        getPrice("platinum"),
                        "platinum",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionCard;
