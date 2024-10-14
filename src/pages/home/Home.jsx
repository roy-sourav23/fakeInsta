import React, { useContext, useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Layout from "../../components/layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import FeedPosts from "../../components/userFeed/FeedPosts";

const Home = () => {
  const { authUser, updateAuthUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [msg, useMsg] = useState(location.state?.msg || "");
  // console.log("msg", msg);
  setTimeout(() => {
    useMsg("");
  }, 4000);

  useEffect(() => {
    document.title = "Home | FakeInsta";
  }, []);

  const handleLogout = (e) => {
    logout();
    navigate("/accounts/login");
  };

  return (
    <Layout>
      <div className="text-center text-white mt-10 w-full ">
        {msg ? (
          <Alert
            severity="success"
            className="absolute w-full max-w-[300px] top-[3rem] right-[4rem]"
          >
            {msg}
          </Alert>
        ) : null}

        <div className="flex h-auto w-full gap-5">
          <div className=" mx-auto  w-[100%] md:w-[70%] lg:w-[70%] ">
            <FeedPosts />
          </div>
          <div className="lg:w-[30%] hidden lg:block mx-auto ">
            <div className="bg-[#212020] py-2 px-3 rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={authUser.profilePicURL}
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <div className="flex flex-col items-start">
                  <p className="text-[0.9rem] font-semibold ">
                    <Link
                      to={`/${authUser.username}`}
                      className="cursor-pointer hover:text-[#0095f6]"
                    >
                      {authUser.username}
                    </Link>
                  </p>
                  <p className="text-[0.77rem]">{authUser.fullName}</p>
                </div>
              </div>
              <p
                onClick={handleLogout}
                className="text-[0.95rem] text-[#ed4956] hover:text-[#f0293a] cursor-pointer"
              >
                logout
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
