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
    if (email === "test@gmail.com") {
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

if(!phoneNumber){
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

    if (!isChecked ) {
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


const SubscriptionCard = ({
  data,
  token,
}) => {
  const router = useRouter();
  const [isYear, setIsYear] = useState(true);
  const [subcriptionData, setSubcriptionData] = useState([]);
  const decoded = token ? jwtDecode(token) : { email: "test@gmail.com" };

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const sectionRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const [planPricing, setPlanPricing] = useState(null);
  const handleShow = (pricing, plan, duration) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setPlanPricing(pricing);
    setDuration(duration);
  };

  const handleClose = () => setShowModal(false);

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

  function formatNumber(num) {
    if (num >= 10000000) {
      // If number is in crores
      return (num / 10000000).toFixed(1) + "Cr";
    } else if (num >= 100000) {
      // If number is in lakhs
      return (num / 100000).toFixed(1) + "L";
    } else if (num >= 1000) {
      // If number is in thousands
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  }

  const scrollTosection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const platinumPlan = data.filter((item) => item.platinum == 1);
  const goldPlan = data.filter((item) => item.gold == 1);
  const silverPlan = data.filter((item) => item.silver == 1);
  const bronzePlan = data.filter((item) => item.bronze == 1);

  const MonthlyPrice = data.filter((item) => item.plan == "Monthly price");
  const AnnualPrice = data.filter((item) => item.plan == "Annual price");

  const handleSubscription = async (
    AMT,
    plan,
    duration
  ) => {
    if (decoded.email == "test@gmail.com") {
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

    // if (!isChecked) {
    //   scrollTosection();
    //   return toast.warn(
    //     "Before purchasing our product, you must acknowledge and agree to our terms and conditions by selecting the checkbox.",
    //     {
    //       position: "top-center",
    //       autoClose: false,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "colored",
    //       transition: Bounce,
    //     }
    //   );
    // }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/create-payment`,
        {
          customer_email: decoded.email,
          AMT,
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Public Key
        amount: AMT * 100,
        currency: "INR",
        name: "Race auto india",
        order_id: data.id,

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
            // alert("Subscription Verified!");
            router.push(
              `/subscription/payment-success?plan=${plan}&duration=${duration}`
            );
          } else {
            router.push(
              `/subscription/payment-failure?plan=${plan}&duration=${duration}`
            );
          }
        },
        prefill: {
          email: decoded.email,
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true, // Enable UPI
          card: true, // Enable Card Payments
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
    if (decoded.email !== "test@gmail.com") {
      subscriptionApi();
    }
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
        <div className="col-md-8 text-center">
          <h2 className="mt-3 font-weight-medium mb-1 text-primary">
            Grow better with right plan
          </h2>
          <h6 className="subtitle">We offer 100% satisfaction</h6>

          <div className="switcher-box mt-4 d-flex align-items-center justify-content-center"></div>

          <div className="btn-group">
            <button
              type="button"
              className={`${!isYear ? "btn-primary" : "btn-secondary"} btn `}
              onClick={() => setIsYear(false)}
            >
              Month
            </button>
            <button
              type="button"
              className={`${isYear ? "btn-primary" : "btn-secondary"} btn `}
              onClick={() => setIsYear(true)}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover border-0 mb-4">
            <div className="card-body font-14">
              {subcriptionData[0]?.plan_name == "bronze" &&
                subcriptionData[0]?.status == "Active" && (
                  <Badge bg="info">Current plan</Badge>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">BRONZE</h5>
              <h6 className="subtitle font-weight-normal">
                For Small Businesses & Startups
              </h6>
              <div className="pricing my-3">
                <sup>₹</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {MonthlyPrice[0].bronze}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {/* {AnnualPrice[0].bronze} */}
                  {formatNumber(AnnualPrice[0].bronze)}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                <span className={isYear ? "d-block" : "d-none"}>
                  Save{" "}
                  <span className="font-weight-medium text-warning">
                    ₹
                    {formatNumber(
                      MonthlyPrice[0].bronze * 12 - AnnualPrice[0].bronze
                    )}
                  </span>{" "}
                  a Year
                </span>
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
                subcriptionData[0].status == "Active" ? null : (
                <div className="bottom-btn">
                  {/* <button
                    className="btn btn-primary-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleSubscription(
                        !isYear
                          ? MonthlyPrice[0].bronze
                          : AnnualPrice[0].bronze,
                        "bronze",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button> */}
                  {/* <button
                    className="btn btn-primary-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        !isYear
                          ? MonthlyPrice[0].bronze
                          : AnnualPrice[0].bronze,
                        "bronze",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover border-0 mb-4">
            <div className="card-body font-14">
              {subcriptionData[0]?.plan_name == "silver" &&
                subcriptionData[0]?.status == "Active" && (
                  <Badge bg="info">Current plan</Badge>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">SILVER</h5>
              <h6 className="subtitle font-weight-normal">
                For Growing Businesses
              </h6>
              <div className="pricing my-3">
                <sup>₹</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {MonthlyPrice[0].silver}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {formatNumber(AnnualPrice[0].silver)}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                <span className={isYear ? "d-block" : "d-none"}>
                  Save{" "}
                  <span className="font-weight-medium text-warning">
                    ₹
                    {formatNumber(
                      MonthlyPrice[0].silver * 12 - AnnualPrice[0].silver
                    )}
                  </span>{" "}
                  a Year
                </span>
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
                subcriptionData[0].status == "Active" ? null : (
                <div className="bottom-btn">
                  {/* <button
                    className="btn btn-danger-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleSubscription(
                        !isYear
                          ? MonthlyPrice[0].silver
                          : AnnualPrice[0].silver,
                        "silver",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button> */}
                  <button
                    className="btn btn-danger-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        !isYear
                          ? MonthlyPrice[0].silver
                          : AnnualPrice[0].silver,
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

        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover border-0 mb-4">
            <div className="card-body font-14">
              {subcriptionData[0]?.plan_name == "gold" &&
                subcriptionData[0]?.status == "Active" && (
                  <Badge bg="info">Current plan</Badge>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">GOLD</h5>
              <h6 className="subtitle font-weight-normal">
                For Expanding Enterprises
              </h6>
              <div className="pricing my-3">
                <sup>₹</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {MonthlyPrice[0].gold}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {formatNumber(AnnualPrice[0].gold)}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                <span className={isYear ? "d-block" : "d-none"}>
                  Save{" "}
                  <span className="font-weight-medium text-warning">
                    ₹
                    {formatNumber(
                      MonthlyPrice[0].gold * 12 - AnnualPrice[0].gold
                    )}
                  </span>{" "}
                  a Year
                </span>
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
                subcriptionData[0].status == "Active" ? null : (
                <div className="bottom-btn">
                  {/* <button
                    className="btn btn-warning-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleSubscription(
                        !isYear ? MonthlyPrice[0].gold : AnnualPrice[0].gold,
                        "gold",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button> */}
                  <button
                    className="btn btn-warning-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        !isYear ? MonthlyPrice[0].gold : AnnualPrice[0].gold,
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

        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-shadow on-hover mb-4 border border-success">
            <div className="card-body font-14">
              <span
                className="badge badge-inverse p-2 position-absolute price-badge font-weight-normal bg-success"
                style={{ color: "white" }}
              >
                Popular
              </span>
              {subcriptionData[0]?.plan_name == "platinum" &&
                subcriptionData[0]?.status == "Active" && (
                  <Badge bg="info">Current plan</Badge>
                )}
              <h5 className="mt-3 mb-1 font-weight-medium">PLATINUM</h5>
              <h6 className="subtitle font-weight-normal">
                For Large Corporations
              </h6>
              <div className="pricing my-3">
                <sup>₹</sup>
                <span className={!isYear ? "display-5" : "d-none"}>
                  {MonthlyPrice[0].platinum}
                </span>
                <span className={isYear ? "display-5" : "d-none"}>
                  {formatNumber(AnnualPrice[0].platinum)}
                </span>
                <small className={!isYear ? "monthly" : "d-none"}>/mo</small>
                <small className={isYear ? "" : "d-none"}>/yr</small>
                <span className={isYear ? "d-block" : "d-none"}>
                  Save{" "}
                  <span className="font-weight-medium text-warning">
                    ₹
                    {formatNumber(
                      MonthlyPrice[0].platinum * 12 - AnnualPrice[0].platinum
                    )}
                  </span>{" "}
                  a Year
                </span>
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
                subcriptionData[0].status == "Active" ? null : (
                <div className="bottom-btn">
                  {/* <button
                    className="btn btn-success-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleSubscription(
                        !isYear
                          ? MonthlyPrice[0].platinum
                          : AnnualPrice[0].platinum,
                        "platinum",
                        !isYear ? "monthly" : "annual"
                      )
                    }
                  >
                    <span>Buy It</span>
                  </button> */}
                  <button
                    className="btn btn-success-gradiant btn-md text-white btn-block"
                    onClick={() =>
                      handleShow(
                        !isYear
                          ? MonthlyPrice[0].platinum
                          : AnnualPrice[0].platinum,
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
