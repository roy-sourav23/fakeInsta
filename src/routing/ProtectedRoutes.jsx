import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector((state) => state.login.user);

  return isAuthenticated ? <Outlet /> : <Navigate to="/accounts/login" />;
};

export default ProtectedRoutes;
