import { BrowserRouter, Route, Routes } from "react-router";
import Profile from "./components/Profile";
import About from "./components/About";
import Login from "./components/Login";
import Feed from "./components/Feed";
import { Provider } from "react-redux";
import appStore from "./store/appStore"
import Body from "./Body";
import { ToastProvider } from "./utils/ToastProvider";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import SignUp from "./components/SignUp";
import Launch from "./components/Launch";
import { useState } from "react";
import { useEffect } from "react";

function App() {
 


  return (
    <>
      <Provider store={appStore}>
        <ToastProvider>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />} >
                <Route path="/" element={<Feed />} />
                <Route path="/launch" element={<Launch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/requests" element={<Requests />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </>
  )
}

export default App
