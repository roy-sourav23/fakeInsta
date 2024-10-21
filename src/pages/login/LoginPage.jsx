import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import "./login.scss";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../../redux/loginSlice.js";

const LoginPage = () => {
  const dispatch = useDispatch();

  const loginSelector = useSelector((state) => state.login);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [msg, setMsg] = useState(location.state?.key || "");
  setTimeout(() => {
    setMsg("");
  }, 4000);

  useEffect(() => {
    document.title = "Login | FakeInsta";
  }, []);

  useEffect(() => {
    if (loginSelector.user) {
      navigate("/", { state: { msg: "login successful!" } });
    }
  }, [loginSelector.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(userLoggedIn(user));
    } catch (e) {
      // console.error("error", e);
      const error = e.code?.split("/");
      if (error) setError(error[1]);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="text-center relative min-h-screen w-full ">
      {msg ? (
        <Alert
          severity="success"
          className="absolute w-full max-w-[300px] top-[3rem] right-[4rem]"
        >
          {msg}
        </Alert>
      ) : null}
      <div className="formContainer">
        <div className="errorContainer">
          <span className="">{error}</span>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="logo">FakeInsta</div>

          <fieldset>
            <label>
              <span className={` ${user.email.length > 0 ? "" : "hidden"}`}>
                Email
              </span>
              <input
                type="email"
                name="email"
                id="email"
                value={user.email}
                placeholder="Email "
                onChange={handleChange}
                className="	"
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              <span className={` ${user.password.length > 0 ? "" : "hidden"}`}>
                Password
              </span>
              <input
                type="password"
                name="password"
                id="password"
                value={user.password}
                placeholder="password "
                onChange={handleChange}
                autoComplete="on"
              />
            </label>
          </fieldset>

          <button
            type="submit"
            className="hover:bg-[#0b3974]"
            disabled={user.email == "" || (user.password == "" && error != "")}
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
