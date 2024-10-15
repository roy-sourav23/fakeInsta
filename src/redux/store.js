import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../redux/loginSlice";
import { useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
