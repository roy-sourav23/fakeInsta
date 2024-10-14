import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useContext(UserContext);
  const isAuthenticated = isLoggedIn;

  return isAuthenticated ? <Outlet /> : <Navigate to="/accounts/login" />;
};

export default ProtectedRoutes;
