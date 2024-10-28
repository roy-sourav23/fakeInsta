import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import Layout from "../../components/layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FeedPosts from "../../components/userFeed/FeedPosts";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/loginSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [msg, setMsg] = useState(location.state?.msg || "");
  const [showMsg, setShowMsg] = useState(true);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.login.user);

  useEffect(() => {
    document.title = "Home | FakeInsta";
    const timeId = setTimeout(() => {
      setShowMsg(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
      setMsg("");
    };
  }, []);

  const handleLogout = (e) => {
    dispatch(logout());
    navigate("/accounts/login", { state: { key: "successfully logged out!" } });
  };

  if (!authUser) {
    return <div>nothing to see</div>;
  }

  return (
    <Layout>
      <div className="text-center text-white mt-10 w-full ">
        {msg && showMsg ? (
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
                {authUser.profilePicURL ? (
                  <img
                    src={authUser.profilePicURL}
                    className="w-[40px] h-[40px] object-cover rounded-full"
                  />
                ) : (
                  <AccountCircleIcon />
                )}
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

export default HomePage;
