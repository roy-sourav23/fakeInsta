import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase.js";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import "./signup.scss";

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    fullName: "",
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup | FakeInsta";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        username: user.userName,
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
      console.error("error", e);
      const error = e.code.split("/");
      setError(error[1]);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="text-center">
      <div className="formContainer">
        <div className="errorContainer">
          <span className="">{error}</span>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <h2 className="logo">FakeInsta</h2>
          <h4 className="sub-title ">
            Sign up to see photos and videos from your friends.
          </h4>

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
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span className={` ${user.fullName.length > 0 ? "" : "hidden"}`}>
                Full Name
              </span>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={user.fullName}
                placeholder="Full Name"
                onChange={handleChange}
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span className={` ${user.userName.length > 0 ? "" : "hidden"}`}>
                Username
              </span>
              <input
                type="text"
                name="userName"
                id="username"
                value={user.userName}
                placeholder="Username"
                onChange={handleChange}
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
            disabled={
              user.email == "" ||
              user.fullName == "" ||
              user.password == "" ||
              (user.userName == "" && error != "")
            }
          >
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

export default Signup;
