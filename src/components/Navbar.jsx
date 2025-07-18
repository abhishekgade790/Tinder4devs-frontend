import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { removeUser } from '../store/userSlice'
import axios from 'axios'
import { BASE_URL } from '../utils/utils'
import { Link, useNavigate } from 'react-router'
import { removeFeed } from '../store/feedSlice'


function Navbar() {
    const user = useSelector(store => store.user)
    const navigate = useNavigate();
    const dispacth = useDispatch();

    const handleLogout = async () => {
        try {
            const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            dispacth(removeUser());
            dispacth(removeFeed())
            navigate("/login")
        } catch (err) {
        }
    }

    const { photoUrl, firstName } = user || "";
    return (
        <div className="navbar bg-base-300 shadow-sm border-b border-neutral-content/10 px-12 h-24">
            <div className="flex-1">
                <Link to={user ? "/" : "/login"} className="btn btn-ghost text-xl">Tinder4devs</Link>
            </div>
            {user &&
                <div className="flex gap-2 items-center">
                    <div className='text-xl '>Welcome, <span className='text-info'>{firstName}</span></div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to={"/profile"} className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><Link to={"/requests"}>Requests</Link></li>
                            <li><Link to={"/connections"}>Connections</Link></li>
                            <li ><Link onClick={handleLogout}>Logout</Link></li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}

export default Navbar
