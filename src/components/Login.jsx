import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';
import { BASE_URL } from '../utils/utils';

const Login = () => {
    const [email, setEmail] = useState("abhishek@gmail.com");
    const [password, setPassword] = useState("Gade@123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            return setError("Please enter both email and password.");
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

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className="card w-96 bg-base-300 shadow-sm">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center">Login</h2>

                    <label className="label">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        className="input w-full focus:outline-none"
                        placeholder="email"
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        className="input w-full focus:outline-none mb-2"
                        placeholder="password"
                    />

                    {error && <p className='text-error ' >{error}</p>}

                    <button className="btn btn-primary btn-block mt-2" onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <p className="text-xs py-2">
                        Don't have an account? click here to <Link to="/register" className='text-primary underline'>sign up</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
