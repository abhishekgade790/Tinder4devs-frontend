import axios from "axios";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router";
import { BASE_URL } from "./utils/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./store/userSlice";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((store) => store.user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
                dispatch(addUser(res.data));
            } catch (err) {
                navigate("/launch");
            }
        };

        if ((location.pathname === "/login" ||location.pathname === "/signup" || location.pathname === "/forgot-password")) return;

        if (!user || Object.keys(user).length === 0) {
            fetchUser();
        }
    }, [location.pathname]);

    return (
        <div className="">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Body;
