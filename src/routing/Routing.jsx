import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import EditProfile from "../pages/profile/editProfile/EditProfile";
import ShowProfile from "../pages/profile/showProfile/ShowProfile";
import Post from "../pages/post/Post";
import ProtectedRoutes from "./ProtectedRoutes";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route element={<ProtectedRoutes />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="accounts">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="edit" element={<EditProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path=":userName" element={<ShowProfile />} />
            <Route path="/p/:postId" element={<Post />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
