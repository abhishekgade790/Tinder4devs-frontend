import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import validator from 'validator';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';
import { BASE_URL } from '../utils/utils';
import { PiEye, PiEyeClosed } from 'react-icons/pi';
import { useToast } from '../utils/ToastProvider';

const Login = () => {
    const [email, setEmail] = useState("abhishek@gmail.com");
    const [password, setPassword] = useState("Gade@123");
    const [birthDate, setBirthDate] = useState("2007-05-04");
    const [newPassword, setNewPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

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

    const handleForgotPassword = async () => {
        if (!validator.isEmail(email)) {
            return setError("Invalid email format.");
        }

        if (!birthDate) {
            return setError("Please enter your birth date.");
        }

        if (!validatePassword(newPassword)) {
            return setError("Password must include uppercase, lowercase, number, and special character.");
        }

        try {
            setLoading(true);
            const response = await axios.patch(
                BASE_URL + "/profile/forgot-password",
                {
                    email,
                    birthDate,
                    newPassword,
                },
                { withCredentials: true }
            );
            toast.success(response?.data?.message || "Password updated.", { duration: 3000 });
            setIsForgotPassword(false); // Go back to login
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

                    {/* Password Field */}
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
                                    className="input w-full focus:outline-none pr-10 "
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

                    {/* Forgot Password Fields */}
                    {isForgotPassword && (
                        <>
                            <label className="label">Birth Date</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => {
                                    setBirthDate(e.target.value);
                                    setError("");
                                }}
                                className="input w-full focus:outline-none"
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
                        </>
                    )}

                    {error && <p className="text-error mt-1">{error}</p>}

                    <button
                        className="btn btn-primary btn-block mt-4"
                        onClick={isForgotPassword ? handleForgotPassword : handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? isForgotPassword
                                ? "Resetting..."
                                : "Logging in..."
                            : isForgotPassword
                                ? "Reset Password"
                                : "Login"}
                    </button>

                    <p
                        className="text-sm underline cursor-pointer mt-2 text-center"
                        onClick={() => {
                            setIsForgotPassword(!isForgotPassword);
                            setError("");
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
