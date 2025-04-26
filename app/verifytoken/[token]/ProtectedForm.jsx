/* eslint-disable react/prop-types */
'use client'
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";


const validationSchema = Yup.object({

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Password must contain at least one letter, one number, one special character"
        )
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
});

function ProtectedForm({ email }) {
    const router=useRouter();
    const passToken = localStorage.getItem("verifyToken")
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = { ...values, email, token: passToken }
                await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/login/update-password`, formData);
                alert("Password changed successfully");
                router.push('/login')
            } catch (error) {
                console.error("Error updating password:", error);
                alert("Failed to update password. Please try again.");
            }
        },
    });

    return (
        <div className="container mt-5 pt-5">
            <div className="row">
                <div className="col-12 col-sm-8 col-md-6 m-auto">
                    <div className="card">
                        <div className="card-body">
                            <h2>Reset Password</h2>
                            <form onSubmit={formik.handleSubmit}>

                                <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter a new password"
                                        {...formik.getFieldProps("password")}
                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-danger">{formik.errors.password}</div>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="Confirm your new password"
                                        {...formik.getFieldProps("confirmPassword")}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className="text-danger">{formik.errors.confirmPassword}</div>
                                    ) : null}
                                </div>
                                <button type="submit" className="btn btn-primary mt-3">
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProtectedForm;
