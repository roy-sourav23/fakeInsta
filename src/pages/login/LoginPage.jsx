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

  const [isError, setIsError] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();

  const [msg, setMsg] = useState(loginSelector.message || "");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(userLoggedIn(user));
  };

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
        {/* <div className="errorContainer">
          <span className="">{error}</span>
        </div> */}
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
            disabled={user.email == "" || (user.password == "" && isError)}
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
