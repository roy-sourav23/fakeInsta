import { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import "./login.scss";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../../redux/loginSlice.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";

const LoginPage = () => {
  const dispatch = useDispatch();

  const loginSelector = useSelector((state) => state.login);

  // const [user, setUser] = useState({
  //   email: "",
  //   password: "",
  // });

  const [isError, setIsError] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();

  const [msg, setMsg] = useState(loginSelector.message || "");

  const [showPassword, setShowPassword] = useState(false);

  const passwordFieldRef = useRef(null);
  const handlePasswordVisibility = (e) => {
    if (showPassword) {
      setShowPassword(false);
      passwordFieldRef.current.type = "password";
    } else {
      setShowPassword(true);
      passwordFieldRef.current.type = "text";
    }
  };

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg(null);
        setIsError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  useEffect(() => {
    document.title = "Login | FakeInsta";
  }, []);

  useEffect(() => {
    if (loginSelector.user) {
      navigate("/", { state: { msg: "login successful!" } });
    } else if (loginSelector.isError) {
      setIsError(true);
      setMsg(loginSelector.message);
    }
  }, [loginSelector, navigate]);

  const {
    values,
    errors,
    touched,
    isValid,
    dirty,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      // e.preventDefault();
      dispatch(userLoggedIn(values));
      // console.log("values", values);
    },
  });

  return (
    <div className="text-center relative min-h-screen w-full ">
      {msg ? (
        <Alert
          severity={`${isError ? "error" : "success"}`}
          className="absolute w-full max-w-[500px] top-[3rem] right-[4rem]"
        >
          {msg}
        </Alert>
      ) : null}
      <div className="formContainer">
        <form onSubmit={handleSubmit} className="form">
          <div className="logo">FakeInsta</div>

          <fieldset>
            <label>
              <span className={` ${values.email.length > 0 ? "" : "hidden"}`}>
                Email
              </span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="	"
              />
            </label>
            <div
              style={{
                color: "red",
                width: "100%",
                fontSize: "12px",
                height: "15px",
                textAlign: "left",
              }}
            >
              {touched.email && errors.email ? <p>{errors.email}</p> : null}
            </div>
          </fieldset>
          <fieldset>
            <label>
              <span
                className={` ${values.password.length > 0 ? "" : "hidden"}`}
              >
                Password
              </span>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                autoComplete="on"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                ref={passwordFieldRef}
              />
              <span
                style={{
                  position: "absolute",
                  right: "0%",
                  top: "0%",
                  cursor: "pointer",
                }}
                onClick={handlePasswordVisibility}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </span>
            </label>
            <div
              style={{
                color: "red",
                width: "100%",
                fontSize: "12px",
                height: "15px",
                textAlign: "left",
              }}
            >
              {touched.password && errors.password ? (
                <p>{errors.password}</p>
              ) : null}
            </div>
          </fieldset>

          <button
            type="submit"
            className="hover:bg-[#0b3974]"
            disabled={!(isValid && dirty)}
          >
            Log in
          </button>
        </form>

        <div className="linkContainer">
          <p>
            Don't have an account?
            <Link to="/accounts/signup/">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
