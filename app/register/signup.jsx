'use client'
import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import './signup.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { auth } from "@/firebase"; // Import Firebase auth
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import GoogleLoginButton from "../login/GoogleLogin";

// Validation schema for form fields with strong password
const validationSchema = Yup.object().shape({
  username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character: @$!%*?&")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupForm = () => {
  const [error, setError] = useState("");
  const router = useRouter()

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(""); // Clear previous error messages
      await axios.post("/api/register", values);
      toast.info("Login success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      // const user = userCredential.user;

      // await sendEmailVerification(user);

      setTimeout(() => {
        router.push('/subscription');           // 1st back → login page

      }, 1000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError("Account already exists.");
        } else if (error.response.status === 400) {
          setError("Invalid data. Please check your inputs.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={3}>
          <div className="signup-box p-4">
            <div className="text-center mb-4">
              <Link href='/'><Image src="/images/black logo with text.png" alt="Logo" width={60} height={70} /></Link>
              {/* <h2 className="mt-2">Sign Up</h2> */}
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Formik
              initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      isInvalid={touched.username && errors.username}
                      placeholder="Enter username"
                    />
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && errors.email}
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && errors.password}
                      placeholder="Password"
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      isInvalid={touched.confirmPassword && errors.confirmPassword}
                      placeholder="Confirm password"
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100">
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                  </Button>
                  <p className="text-center text-muted mt-2 mb-1 p-0 m-0">or</p>
                  <div className="d-flex justify-content-center mb-3"><GoogleLoginButton /></div>
                  <div className="text-center mt-3">
                    <span>Already have an account? </span><Link href="/login" className="text-primary">Login</Link>
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

export default SignupForm;
