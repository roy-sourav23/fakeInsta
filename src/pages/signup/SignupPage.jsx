import { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase.js";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import "./signup.scss";
import { useFormik } from "formik";
import * as Yup from "yup";

const SignupPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup | FakeInsta";
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const confirmPasswordFieldRef = useRef(null);
  const handleConfirmPasswordVisibility = (e) => {
    if (showPassword) {
      setShowConfirmPassword(false);
      confirmPasswordFieldRef.current.type = "password";
    } else {
      setShowConfirmPassword(true);
      confirmPasswordFieldRef.current.type = "text";
    }
  };

  const handleError = (error) => {
    if (error === "auth/email-already-in-use") {
      setError("email address already exists!");
    }
  };

  const handleSignup = async (user) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const { uid } = response.user;

      // create an userDocument in users collection
      const response2 = await setDoc(doc(db, "users", uid), {
        uid: uid,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        accountType: "public",
        isVerfied: false,
        profilePicURL: "",
        bio: "",
        website_url: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        followers: [],
        following: [],
        posts: [],
      });

      // console.log("reponse2", response2);

      navigate("/accounts/login", { state: { key: "signup successful!" } });
    } catch (e) {
      handleError(e.code);
    }
  };

  const initialValues = {
    email: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    fullName: Yup.string()
      .required("Required")

      .min(3, "Fullname must contain at least 3 characters")
      .matches(
        /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/,
        "Full name must be capitalized"
      ),

    username: Yup.string()
      .min(2, "Username should be at least 2 characters")
      .matches(
        /^[a-z0-9]+$/,
        "Username must contain only lowercase letters and numbers"
      )
      .required("Required"),
    password: Yup.string()
      .min(6, "Password should be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (user) => {
      await handleSignup(user);
    },
  });

  return (
    <div className="text-center">
      <div className="formContainer">
        <div className="errorContainer">
          <span className="">{error}</span>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <h2 className="logo">FakeInsta</h2>
          <h4 className="sub-title ">
            Sign up to see photos from your friends.
          </h4>

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
              />
            </label>
            <div
              style={{
                height: "10px",
                fontSize: "10.5px",
                color: "red",
                textAlign: "left",
                margin: "0 0.4rem",
              }}
            >
              {touched.email && errors.email ? <p>{errors.email}</p> : null}
            </div>
          </fieldset>

          <fieldset>
            <label>
              <span
                className={` ${values.fullName.length > 0 ? "" : "hidden"}`}
              >
                Full Name
              </span>
              <input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Full Name"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </label>
            <div
              style={{
                height: "10px",
                fontSize: "10.5px",
                color: "red",
                textAlign: "left",
                margin: "0 0.4rem",
              }}
            >
              {touched.fullName && errors.fullName ? (
                <p>{errors.fullName}</p>
              ) : null}
            </div>
          </fieldset>

          <fieldset>
            <label>
              <span
                className={` ${values.username.length > 0 ? "" : "hidden"}`}
              >
                Username
              </span>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </label>
            <div
              style={{
                height: "10px",
                fontSize: "10.5px",
                color: "red",
                textAlign: "left",
                margin: "0 0.4rem",
              }}
            >
              {touched.username && errors.username ? (
                <p>{errors.username}</p>
              ) : null}
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
                placeholder="password "
                autoComplete="on"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
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
                height: "10px",
                fontSize: "10.5px",
                color: "red",
                textAlign: "left",
                margin: "0 0.4rem",
              }}
            >
              {touched.password && errors.password ? (
                <p>{errors.password}</p>
              ) : null}
            </div>
          </fieldset>

          <fieldset>
            <label>
              <span
                className={` ${
                  values.confirmPassword.length > 0 ? "" : "hidden"
                }`}
              >
                Confirm Password
              </span>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm password "
                autoComplete="on"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={confirmPasswordFieldRef}
              />
              <span
                style={{
                  position: "absolute",
                  right: "0%",
                  top: "0%",
                  cursor: "pointer",
                }}
                onClick={handleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </span>
            </label>
            <div
              style={{
                height: "10px",
                fontSize: "10.5px",
                color: "red",
                textAlign: "left",
                margin: "0 0.4rem",
              }}
            >
              {touched.confirmPassword && errors.confirmPassword ? (
                <p>{errors.confirmPassword}</p>
              ) : null}
            </div>
          </fieldset>

          <button type="submit" disabled={!(isValid && dirty)}>
            Sign up
          </button>
        </form>

        <div className="linkContainer">
          <p>
            Have an account?
            <Link to="/accounts/login/">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
