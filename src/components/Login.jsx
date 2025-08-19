import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import validator from "validator";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { BASE_URL } from "../utils/utils";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useToast } from "../utils/ToastProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return validator.isStrongPassword(pwd, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  };

  // Login
  const handleLogin = async () => {
    if (!validator.isEmail(email)) {
      return setError("Invalid email format.");
    }

    if (!password) {
      return setError("Please enter your password.");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!validator.isEmail(email)) {
      return setError("Invalid email format.");
    }

    try {
      setLoading(true);
      const response = await axios.post(BASE_URL + "/forgot-password/send-otp", { email });
      console.log(response)
      if (response.data.success) {
        toast.success("OTP sent to your email", { duration: 3000 });
        setOtpSent(true);
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err?.response?.data || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password using OTP
  const handleResetPassword = async () => {
    if (!otp) {
      return setError("Please enter OTP.");
    }

    if (!validatePassword(newPassword)) {
      return setError(
        "Password must include uppercase, lowercase, number, and special character."
      );
    }

    try {
      setLoading(true);
      const response = await axios.patch(BASE_URL + "/forgot-password/reset", {
        email,
        otp,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password reset successfully", { duration: 3000 });
        setIsForgotPassword(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err?.response?.data || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-[400px] bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-2">
            {isForgotPassword ? "Forgot Password" : "Login"}
          </h2>

          {/* Email Field */}
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="input w-full focus:outline-none"
            placeholder="email"
          />

          {/* Password Field (for login only) */}
          {!isForgotPassword && (
            <>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="input w-full focus:outline-none pr-10"
                  placeholder="password"
                />
                <span
                  className="absolute right-2 top-3 cursor-pointer text-lg z-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <PiEyeClosed /> : <PiEye />}
                </span>
              </div>
            </>
          )}

          {/* Forgot Password Flow */}
          {isForgotPassword && (
            <>
              {!otpSent ? (
                <button
                  className="btn btn-warning btn-block mt-3"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <>
                  <label className="label">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError("");
                    }}
                    className="input w-full focus:outline-none"
                    placeholder="Enter OTP"
                  />

                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      className="input w-full focus:outline-none pr-10"
                      placeholder="new password"
                    />
                    <span
                      className="absolute right-2 top-3 cursor-pointer text-lg z-10"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? <PiEyeClosed /> : <PiEye />}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-block mt-4"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}
            </>
          )}

          {error && <p className="text-error mt-1">{error}</p>}

          {!isForgotPassword && (
            <button
              className="btn btn-primary btn-block mt-4"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          )}

          <p
            className="text-sm underline cursor-pointer mt-2 text-center"
            onClick={() => {
              setIsForgotPassword(!isForgotPassword);
              setError("");
              setOtpSent(false);
              setOtp("");
              setNewPassword("");
            }}
          >
            {isForgotPassword ? "← Back to Login" : "Forgot your password?"}
          </p>

          {!isForgotPassword && (
            <>
              <div className="divider">Or</div>
              <p className="text-sm text-center">
                <Link to="/signup" className="underline text-primary">
                  <button className="btn w-full">Create New Account</button>
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
