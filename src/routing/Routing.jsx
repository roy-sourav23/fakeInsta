import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import SignupPage from "../pages/signup/SignupPage";
import EditProfilePage from "../pages/profile/editProfile/EditProfilePage";
import ShowProfilePage from "../pages/profile/showProfile/ShowProfilePage";
import SinglePostPage from "../pages/post/SinglePostPage";
import ProtectedRoutes from "./ProtectedRoutes";
import HomePage from "../pages/home/HomePage";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route element={<ProtectedRoutes />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="accounts">
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="edit" element={<EditProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path=":userName" element={<ShowProfilePage />} />
            <Route path="/p/:postId" element={<SinglePostPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
