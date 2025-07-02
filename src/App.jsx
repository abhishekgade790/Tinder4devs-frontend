import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import About from "./components/About";
import Login from "./components/Login";
import Home from "./components/Home";
import Footer from "./components/Footer";

function App() {
  const Body = () => {
    return (
      <div>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    )
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />} >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
