/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import GoogleLoginButton from "./GoogleLogin";
import './login.css'

// Validation schema for form fields
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(""); // Clear previous error messages

      // Call backend login API
      await axios.post("/api/login", values);

      toast.info("Login Success!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Redirect after login
      setTimeout(() => {
        router.back();
        router.refresh();
      }, 1000);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setError("Account already exists.");
        } else if (err.response.status === 404) {
          setError("Account not found. Please check your credentials.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        console.error(err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        setError("Verification email sent! Please check your inbox.");
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("No user logged in or email already verified.");
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={3}>
          <div className="login-box p-4">
            <div className="text-center mb-4">
              <Link href="/">
                <Image src="/images/black logo with text.png" alt="Logo" width={60} height={70} />
              </Link>
              <h2 className="mt-2">Login</h2>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit: formikSubmit,
                handleChange,
                values,
                touched,
                errors,
                isSubmitting
              }) => (
                <Form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    formikSubmit();
                  }}
                >
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && !!errors.email}
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && !!errors.password}
                      placeholder="Password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="text-end mb-3">
                    <Link href="/reset-password" className="text-muted">Forgot Password?</Link>
                  </div>

                  <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>

                  <p className="text-center text-muted mt-2 mb-1">or</p>
                  <div className="d-flex justify-content-center mb-3">
                    <GoogleLoginButton />
                  </div>

                  <div className="text-center mt-3">
                    <span>Don't have an account? </span>
                    <Link href="/register" className="text-primary">Signup</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
