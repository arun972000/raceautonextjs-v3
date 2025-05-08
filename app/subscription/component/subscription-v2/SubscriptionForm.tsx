"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, Form } from "react-bootstrap";
import Image from "next/image";

import PlanDetailsForm from "./PlanDetailsForm";
import ManualPaymentForm from "./ManualPaymentForm";
import BankTransferForm from "./BankTranferForm";
import RazorpayPaymentForm from "./RazorPayForm";
import AuthModal from "@/app/test/components/LoginFormTest";

const SubscriptionForm = ({ plan }: { plan: string }) => {
  const router = useRouter();

  const [planInfo, setPlanInfo] = useState<{
    planTier: string;
    billingCycle: "monthly" | "annual";
    price: number;
  } | null>(null);

  const [show, setShow] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [payType, setPayType] = useState<"UPI" | "BANK" | "Card Payment">("UPI");
  const [token, setToken] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    setToken(authToken || null);
  }, []);

  const handleBuyClick = () => {
    if (!token) {
      toast.warn("Please login to subscribe", { position: "top-center" });
      setShowAuth(true);
    } else {
      setShow(true);
    }
  };

  const close = () => {
    setShow(false);
    setStep(1);
  };

  const next = (
    planTier: string,
    billingCycle: "monthly" | "annual",
    price: number
  ) => {
    setPlanInfo({ planTier, billingCycle, price });
    setStep(2);
  };

  const back = () => setStep(1);

  return (
    <>
      {/* Auth Modal */}
      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />

      {/* Buy Button */}
      <div className="text-center">
        <Button variant="dark" onClick={handleBuyClick}>
          Buy Now
        </Button>
      </div>

      {/* Subscription Modal */}
      <Modal show={show} onHide={close} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1
              ? "Confirm Subscription"
              : payType === "UPI"
              ? "UPI / Manual Payment"
              : payType === "BANK"
              ? "Bank Transfer"
              : "Card Payment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 ? (
            <PlanDetailsForm onNext={next} plan={plan} />
          ) : (
            <>
              {/* Payment Options */}
              <div className="mb-3">
                <Form.Check
                  inline
                  type="radio"
                  name="pay"
                  id="upi"
                  label="UPI"
                  checked={payType === "UPI"}
                  onChange={() => setPayType("UPI")}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="pay"
                  id="bank"
                  label="Bank Transfer"
                  checked={payType === "BANK"}
                  onChange={() => setPayType("BANK")}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="pay"
                  id="Card Payment"
                  label="Card Payment"
                  checked={payType === "Card Payment"}
                  onChange={() => setPayType("Card Payment")}
                />
              </div>

              {/* Payment Form */}
              {payType === "UPI" && (
                <>
                  <ManualPaymentForm closeModal={close} planInfo={planInfo} />
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <div className="payment-info">
                        <h6>Subscribe using any of the payment methods below:</h6>
                        <p>
                          Account Name:{" "}
                          <span className="text-primary">RACE EDITORIALE LLP</span>
                        </p>
                        <p>
                          Account Number:{" "}
                          <span className="text-primary">218505001886</span>
                        </p>
                        <p>
                          IFSC: <span className="text-primary">ICIC0002185</span>
                        </p>
                        <p>
                          Branch Name:{" "}
                          <span className="text-primary">Saidapet Branch</span>
                        </p>
                        <p>
                          UPI ID:{" "}
                          <span className="text-primary">
                            raceeditorialellp.9840490241.ibz@icici
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-center">
                      <Image
                        src="/images/upi scanner-uuIYAzO1.png"
                        alt="upi scanner"
                        width={120}
                        height={120}
                      />
                    </div>
                  </div>
                </>
              )}

              {payType === "BANK" && (
                <BankTransferForm closeModal={close} planInfo={planInfo} />
              )}

              {payType === "Card Payment" && (
                <RazorpayPaymentForm closeModal={close} planInfo={planInfo} />
              )}

              <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={back}>
                  Back
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SubscriptionForm;
