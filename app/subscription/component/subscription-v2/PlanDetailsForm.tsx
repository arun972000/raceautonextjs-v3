"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaMedal } from "react-icons/fa";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "./planDetails.css"; // Custom styles for shake animation

interface PlanDetailsFormProps {
  onNext: (
    planTier: string,
    billingCycle: "monthly" | "annual",
    price: number
  ) => void;
  plan: string; // "platinum" | "gold" | "silver"
}

const PlanDetailsForm: React.FC<PlanDetailsFormProps> = ({ onNext, plan }) => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [planTier, setPlanTier] = useState<string>(plan.toLowerCase());
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [price, setPrice] = useState<number>(0);
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [shakeCheckbox, setShakeCheckbox] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setToken(token);
      const decoded: any = jwtDecode(token);
      setEmail(decoded.email);
    }
  }, []);

  useEffect(() => {
    if (email) {
      phoneDataApi();
    }
  }, [email]);

  useEffect(() => {
    planApi();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const monthlyData = data.find((item) => item.plan === "Monthly price");
    const annualData = data.find((item) => item.plan === "Annual price");
    const key = planTier;
    const computed =
      billingCycle === "monthly"
        ? monthlyData?.[key] ?? 0
        : annualData?.[key] ?? 0;
    setPrice(computed);
  }, [data, planTier, billingCycle]);

  const planApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const phoneDataApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/auth/phone/${email}`
      );
      setPhoneNumber(res.data[0].phone_number);
      const verified = res.data[0].phone_status === 1;
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
      setVerifiedOtp(true);
      toast.success("Phone verified successfully!");
    } catch (error) {
      setMessage("Invalid OTP, try again.");
    }
    setLoading(false);
  };

  const handleCountryCodeChange = (e: any) => setCountryCode(e.target.value);
  const handlePhoneChange = (e: any) => setPhoneNumber(e.target.value);
  const handleChange = (event: any) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) setShakeCheckbox(false);
  };

  const handleNext = () => {
    if (!email) {
      toast.warning("Please login first to continue.");
      router.push("/login");
      return;
    }

    if (!isChecked) {
      setShakeCheckbox(true);
      toast.warn("Please agree to the terms and conditions before proceeding.");
      setTimeout(() => setShakeCheckbox(false), 500);
      return;
    }

    onNext(planTier, billingCycle, price);
  };

  return (
    <div className="card border-0">
      <div className={`card-header text-white ${planTier}-gradient d-flex align-items-center justify-content-between`}>
        <div className="d-flex align-items-center">
          <span className={`plan-badge ${planTier}`}>
            <FaMedal />
          </span>
          <span className="ms-2 fw-bold">{planTier.toUpperCase()} PLAN</span>
        </div>
      </div>

      <div className="card-body">
        <p className="text-muted">
          Unlock all exclusive <strong>{planTier}</strong> plan features after purchasing.
        </p>

        <Form>
          <Form.Group className="mb-3" controlId="planTierSelect">
            <Form.Label>Select Plan Tier</Form.Label>
            <Form.Select value={planTier} onChange={(e) => setPlanTier(e.target.value)}>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Billing Cycle</Form.Label>
            <div>
              <Form.Check
                inline
                label="Monthly"
                name="billing"
                type="radio"
                id="billing-monthly"
                checked={billingCycle === "monthly"}
                onChange={() => setBillingCycle("monthly")}
              />
              <Form.Check
                inline
                label="Annual"
                name="billing"
                type="radio"
                id="billing-annual"
                checked={billingCycle === "annual"}
                onChange={() => setBillingCycle("annual")}
              />
            </div>
          </Form.Group>

          <div className="mb-3">
            <strong>Price: </strong>
            <span className="price-badge">₹{price}</span>
          </div>

          <Form.Group className="mb-3">
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
            <div className="d-flex gap-2">
              <Form.Select
                value={countryCode}
                onChange={handleCountryCodeChange}
                className="custom-input"
                style={{ maxWidth: "100px" }}
                disabled={verifiedOtp}
              >
                {[
                  "+1", "+7", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39", "+40", "+41",
                  "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52", "+53", "+54", "+55", "+56",
                  "+57", "+58", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+81", "+82", "+84", "+86",
                  "+90", "+91", "+92", "+93", "+94", "+95", "+98", "+211", "+212", "+213", "+216", "+218",
                  "+220", "+221", "+222", "+223", "+224", "+225", "+226", "+227", "+228", "+229", "+230",
                  "+231", "+232", "+233", "+234", "+235", "+236", "+237", "+238", "+239", "+240", "+241",
                  "+242", "+243", "+244", "+245", "+246", "+248", "+249", "+250", "+251", "+252", "+253",
                  "+254", "+255", "+256", "+257", "+258", "+260", "+261", "+262", "+263", "+264", "+265",
                  "+266", "+267", "+268", "+269", "+290", "+291", "+297", "+298", "+299", "+350", "+351",
                  "+352", "+353", "+354", "+355", "+356", "+357", "+358", "+359", "+370", "+371", "+372",
                  "+373", "+374", "+375", "+376", "+377", "+378", "+379", "+380", "+381", "+382", "+383",
                  "+385", "+386", "+387", "+389", "+420", "+421", "+423", "+500", "+501", "+502", "+503",
                  "+504", "+505", "+506", "+507", "+508", "+509", "+590", "+591", "+592", "+593", "+594",
                  "+595", "+596", "+597", "+598", "+599", "+670", "+672", "+673", "+674", "+675", "+676",
                  "+677", "+678", "+679", "+680", "+681", "+682", "+683", "+685", "+686", "+687", "+688",
                  "+689", "+690", "+691", "+692", "+850", "+852", "+853", "+855", "+856", "+880", "+886",
                  "+960", "+961", "+962", "+963", "+964", "+965", "+966", "+967", "+968", "+970", "+971",
                  "+972", "+973", "+974", "+975", "+976", "+977", "+992", "+993", "+994", "+995", "+996",
                  "+998"
                ].map((code) => (
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
            <div className="text-center my-2">
              <Button onClick={verifyOTP} disabled={!phoneNumber} className="btn btn-success">
                Verify
              </Button>
            </div>
          )}

          {message && <p className="text-center text-muted mt-2">{message}</p>}

          {isVerified && (
            <p className="info-text">
              Your email ID and phone number are retrieved from your login information
            </p>
          )}

          <Form.Group className="mb-3">
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                required
                className={`checkbox-custom ${shakeCheckbox ? "shake" : ""}`}
              />

              <Form.Label className="mb-0">
                I agree to the{" "}
                <Link href="/terms-conditions" className="text-primary">
                  terms and conditions
                </Link>{" "}
                regarding this purchase
              </Form.Label>
            </div>
          </Form.Group>
        </Form>
      </div>

      <div className="card-footer d-flex justify-content-end gap-2">
        <Button variant="primary" onClick={handleNext} disabled={!email}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PlanDetailsForm;
