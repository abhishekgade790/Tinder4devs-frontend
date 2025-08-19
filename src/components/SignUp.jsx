import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import validator from "validator";
import { BASE_URL } from "../utils/utils";
import { addUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "../utils/ToastProvider";

import { PiEye, PiEyeClosed } from "react-icons/pi";

const SignUpFlow = () => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const toast = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        photoUrl: "",
        about: "",
        skills: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photoUrl" && files?.[0]) {
            const url = URL.createObjectURL(files[0]);
            setUserData((prev) => ({ ...prev, photoUrl: url }));
        } else {
            setUserData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Timer countdown for resend OTP
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const sendOtp = async () => {
        if (!validator.isEmail(userData.email)) {
            setError("Enter a valid email before requesting OTP.");
            return;
        }
        setError("");
        setOtpLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/send-otp`, { email: userData.email });
            if (res.data.success) {
                setOtpSent(true);
                setCooldown(60); // disable button for 60s
                toast.success("OTP sent successfully!");
            } else {
                setError(res.data.message || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Error sending OTP. Try again.");
            console.error(err);
        } finally {
            setOtpLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }
        setError("");
        try {
            const res = await axios.post(`${BASE_URL}/verify-otp`, {
                email: userData.email,
                otp,
            });
            if (res.data.success) {
                toast.success("Email verified successfully!");
                setVerified(true);
            } else {
                setError(res.data.message || "Invalid OTP.");
            }
        } catch (err) {
            setError("Error verifying OTP. Try again.");
            console.error(err);
        }
    };

    const nextStep = () => {
        if (!userData.email || !userData.password) {
            setError("Email and Password are required.");
            return;
        }
        if (!validator.isEmail(userData.email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (
            !validator.isStrongPassword(userData.password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
            })
        ) {
            setError(
                "Password must be at least 8 characters long and include uppercase, lowercase, and a number."
            );
            return;
        }
        setError("");
        setStep(1);
    };


    const handleSubmit = async () => {
        // Validate required personal fields
        if (
            !userData.firstName.trim() ||
            !userData.lastName.trim() ||
            !userData.birthDate.trim() ||
            !["male", "female", "other"].includes(userData.gender.toLowerCase())
        ) {
            setError("First name, last name, birth date, and gender are required.");
            return;
        }

        if (validator.isAlpha(userData.firstName) === false || validator.isAlpha(userData.lastName) === false) {
            setError("First name and last name should only contain letters.");
            return;
        }
        if (userData.skills && !validator.isAlphanumeric(userData.skills.replace(/,/g, ""))) {
            setError("Skills should only contain letters, numbers, and commas.");
            return;
        }
        if (userData.photoUrl && !validator.isURL(userData.photoUrl)) {
            setError("Please enter a valid URL for the profile picture.");
            return;
        }
        const today = new Date();
        const birthDate = new Date(userData.birthDate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (age < 18 || (age === 18 && monthDiff < 0)) {
            setError("You must be at least 18 years old to create an account.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // Prepare payload with only non-empty fields
            const payload = {};
            for (const key in userData) {
                const value = userData[key];
                if (value !== "" && value !== null && value !== undefined) {
                    if (key === "gender") {
                        payload[key] = value.toLowerCase();
                    } else if (key === "skills") {
                        payload[key] = value.split(",").map((s) => s.trim()).filter(Boolean);
                    } else if (key !== "confirmPassword") {
                        payload[key] = value;
                    }
                }
            }

            const response = await axios.post(`${BASE_URL}/signup`, payload, {
                withCredentials: true,
            });

            if (response.data.message == "success") {
                const data = await axios.post(`${BASE_URL}/login`, {
                    email: userData.email, password: userData.password
                }, { withCredentials: true });
                dispatch(addUser(data.data));
                toast.success(`Signup successful! Welcome ${data.data.firstName} to Tinder4Devs.`, { duration: 3000 });
                navigate("/");
            } else {
                setError(response.data.message || "Signup failed. Please try again.");
            }

        } catch (err) {
            setError("Signup failed. Please try again.");
            console.error("Signup error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
            <div className="card w-full max-w-[400px] bg-base-300 shadow-xl">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center">
                        {step === 0 ? "Credentials" : "Personal Details"}
                    </h2>

                    {step === 0 && (
                        <>
                            <div>
                                <label className="label">Email</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="input input-bordered focus:outline-none w-full"
                                        disabled={verified} // lock email after verification
                                    />
                                    <button
                                        type="button"
                                        className={`btn ${verified ? "btn-success" : "btn-warning"} shadow-none`}
                                        disabled={!userData.email || cooldown > 0 || otpLoading || verified}
                                        onClick={sendOtp}
                                    >
                                        {verified
                                            ? "Verified ✓"
                                            : otpLoading
                                                ? "Sending..."
                                                : cooldown > 0
                                                    ? `Resend in ${cooldown}s`
                                                    : otpSent
                                                        ? "Resend OTP"
                                                        : "Send OTP"}
                                    </button>
                                </div>

                                {/* show OTP + Verify only if OTP is sent and not verified yet */}
                                {otpSent && !verified && (
                                    <>
                                        <input
                                            type="text"
                                            name="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP"
                                            className="input w-full mt-2"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-primary mt-2"
                                            onClick={verifyOtp}
                                        >
                                            Verify
                                        </button>
                                    </>
                                )}
                            </div>


                            <label className="label">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Example@123"
                                    value={userData.password}
                                    onChange={handleChange}
                                    className="input input-bordered focus:outline-none w-full "
                                />
                                <span
                                    className="absolute right-2 top-3 cursor-pointer text-lg z-10"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <PiEyeClosed /> : <PiEye />}
                                </span>
                            </div>

                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Example@123"
                                    value={userData.confirmPassword}
                                    onChange={handleChange}
                                    className="input input-bordered focus:outline-none w-full"
                                />
                                <span
                                    className="absolute right-2 top-3 cursor-pointer text-lg z-10"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <PiEyeClosed /> : <PiEye />}
                                </span>
                            </div>

                            {error && <p className="text-error text-sm">{error}</p>}

                            <button className="btn btn-primary w-full mt-4" onClick={nextStep}>
                                Next
                            </button>

                            <div className="divider">Or</div>

                            <Link to="/login" className="text-primary underline">
                                <button className="btn w-full">Login to Existing Account</button>
                            </Link>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <div className="flex justify-center flex-col items-center gap-2 mb-4">
                                {userData.photoUrl ? (
                                    <img
                                        src={userData.photoUrl}
                                        alt="Profile Preview"
                                        className="mask mask-squircle w-24 h-24 object-cover"
                                    />
                                ) : (
                                    <label className="btn btn-outline btn-sm" disabled>
                                        Upload Photo
                                        <input
                                            type="file"
                                            name="photoUrl"
                                            onChange={handleChange}
                                            className="hidden"
                                            accept="image/*"
                                            disabled
                                        />
                                    </label>
                                )}
                                <label className="label">Or</label>
                                <input
                                    type="text"
                                    name="photoUrl"
                                    placeholder="Paste image URL"
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <input
                                name="firstName"
                                placeholder="First Name *"
                                value={userData.firstName}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-2"
                            />
                            <input
                                name="lastName"
                                placeholder="Last Name *"
                                value={userData.lastName}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-2"
                            />
                            <input
                                type="date"
                                name="birthDate"
                                value={userData.birthDate}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-2"
                            />

                            <select
                                name="gender"
                                value={userData.gender}
                                onChange={handleChange}
                                className="select select-bordered w-full mb-2"
                            >
                                <option value="">Select Gender *</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            <textarea
                                name="about"
                                placeholder="Tell us about yourself"
                                value={userData.about}
                                onChange={handleChange}
                                className="textarea textarea-bordered w-full mb-2"
                            />

                            <input
                                name="skills"
                                placeholder="Skills (comma separated)"
                                value={userData.skills}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-2"
                            />

                            {error && <p className="text-error text-sm">{error}</p>}

                            <button
                                className={`btn btn-primary w-full ${loading ? "" : ""}`}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading && <span className="loading loading-spinner"></span>}
                                {loading ? "Signing Up..." : "Finish Signup"}
                            </button>

                            <button className="btn btn-ghost text-sm" onClick={() => setStep(0)}>
                                ← Back
                            </button>
                        </>
                    )}                </div>
            </div>
        </div>
    );
};

export default SignUpFlow;
