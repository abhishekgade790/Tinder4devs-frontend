import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { removeUser } from '../store/userSlice'
import axios from 'axios'
import { BASE_URL } from '../utils/utils'
import { Link, useNavigate } from 'react-router'
import { removeFeed } from '../store/feedSlice'
import { Github, Heart, Users, Code2, Zap, User, Settings, UserPlus, LogOut, Bell } from 'lucide-react'
import { addRequests } from '../store/requestSlice'

function Navbar() {
    const user = useSelector(store => store.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const requests = useSelector(store => store.requests);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
            dispatch(addRequests(res?.data?.connectionRequests || []));
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            dispatch(removeUser());
            dispatch(removeFeed())
            navigate("/login")
        } catch (err) {
            console.error('Logout error:', err);
        }
    }
    useEffect(() => {
        if (!requests || requests.length === 0) {
            fetchRequests();
        }
    }, []);

    const { photoUrl, firstName } = user || {};


    return (
        <div className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 border-b border-primary/50 shadow-lg px-4 md:px-8 lg:px-12 h-24">
            {/* Logo Section */}
            <div className="flex-1 ">
                <Link
                    to={user ? "/" : "/login"}
                    className="flex  items-center text-xl md:text-3xl font-bold"
                >

                    <Heart className="w-7 h-7 text-primary mr-1" />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Tinder4Devs
                    </span>
                </Link>
            </div>



            {/* Right Section */}
            <div className="flex-none">
                {!user ? (
                    // CTA Buttons for non-authenticated users
                    <div className="flex gap-2 items-center">
                        {/* Mobile Menu Button */}
                        <div className="lg:hidden dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link to="/login" className="flex items-center gap-2">
                                        <Github className="w-5 h-5" />
                                        Sign in with GitHub
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="flex items-center gap-2 text-primary">
                                        <Heart className="w-5 h-5" />
                                        Get Started
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden lg:flex gap-2">
                            <Link
                                to="/login"
                                className="btn btn-ghost btn-md hover:btn-secondary transition-all duration-300"
                            >
                                <Github className="w-5 h-5" />
                                <span className="hidden xl:inline">GitHub</span>
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-primary btn-md hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                <Heart className="w-5 h-5" />
                                Get Started
                            </Link>
                        </div>
                    </div>
                ) : (
                    // User Profile Section
                    <div className="flex gap-3 items-center">
                        {/* Welcome Message */}
                        <div className='text-xl hidden md:block text-base-content'>
                            Welcome back,
                            <span className='text-primary font-semibold ml-1'>{firstName}</span>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary/30 transition-all duration-300"
                            >
                                <div className="w-14 rounded-full ring-2 ring-primary/20">
                                    <img
                                        alt="Profile"
                                        src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-md rounded-2xl z-[1] mt-3 w-64 p-3 shadow-2xl border border-primary/10"
                            >
                                {/* Profile Header */}
                                <li className="menu-title text-primary font-semibold mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Account
                                    </div>
                                </li>

                                <li>
                                    <Link
                                        to="/profile"
                                        className="flex items-center justify-between hover:bg-primary/10 transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </div>
                                        <span className="badge badge-secondary badge-xs">New</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/requests"
                                        className="flex items-center gap-2 hover:bg-secondary/10 transition-colors duration-200"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Requests
                                        <div className="indicator-item badge badge-primary badge-xs ml-auto">{requests == null ? '' : requests.length}</div>
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/connections"
                                        className="flex items-center gap-2 hover:bg-accent/10 transition-colors duration-200"
                                    >
                                        <Users className="w-4 h-4" />
                                        Connections
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-2 hover:bg-info/10 transition-colors duration-200"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                </li>

                                <div className="divider my-2"></div>

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 hover:bg-error/10 text-error hover:text-error transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar