import "./sidebar.scss";
import React, { useContext, useRef, useState } from "react";
import {
  HomeOutlined as HomeOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  ExploreOutlined as ExploreOutlinedIcon,
  MovieOutlined as MovieOutlinedIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  AddBoxOutlined as AddBoxOutlinedIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { Link, NavLink } from "react-router-dom";
import PostModal from "../postModal/PostModal";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase.js";

import FollowUnfollowButton from "../followUnfollowButton./FollowUnfollowButton.jsx";
import { useSelector } from "react-redux";

const SidebarDrawer = ({ open }) => {
  const formRef = useRef(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const authUser = useSelector((state) => state.login.user);

  const getUserByUsername = async (userName) => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("username", "==", userName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userFound = await getUserByUsername(username);
    setUser(userFound);
    formRef.current.reset();
  };

  return (
    <div
      className={`h-full w-[280%] absolute ${
        open ? "flex " : "hidden"
      } z-10 border-r border-[#434343] bg-black text-[#a8a8a8]`}
    >
      <div className="w-[36%]"></div>
      <div className="w-[64%] py-7 px-6">
        <h2 className="text-[#a8a8a8] text-[2rem] font-semibold">Search</h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="py-7 w-full text-[#f5f5f5]"
        >
          <label className="bg-[#343333] py-1.5 px-2 rounded flex cursor-pointer">
            <SearchOutlinedIcon />
            <input
              type="text"
              name="searchField"
              id=""
              placeholder="Search by username"
              onChange={handleChange}
              className="bg-transparent border-none outline-none px-2 text-sm"
            />
          </label>
        </form>

        {user ? (
          <div>
            <small>results</small>
            <div className="bg-[#212020] py-2 px-3 rounded flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img
                  src={user.profilePicURL}
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <p>
                  <NavLink
                    to={`/${user.username}`}
                    className="cursor-pointer hover:text-[#0095f6]"
                  >
                    {user.username}
                  </NavLink>
                </p>
              </div>
              {authUser.username != user.username ? (
                <FollowUnfollowButton userID={user.uid} />
              ) : null}
            </div>
          </div>
        ) : (
          <p>user does not exist!</p>
        )}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const authUser = useSelector((state) => state.login.user);

  const [open, setOpen] = useState(false);
  const [openSearchField, setOpenSearchField] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleSearchField = () => {
    setOpenSearchField((prevValue) => !prevValue);
  };

  return (
    <div className=" flex fixed">
      <div className="sidebar z-20 ">
        <PostModal open={open} handleClose={handleClose} />
        <div className="logo">FakeInsta</div>
        <ul className="iconList">
          <li>
            <div className="navContent">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <HomeOutlinedIcon className="icon" />
                <span>Home</span>
              </NavLink>
            </div>
          </li>
          <li onClick={toggleSearchField}>
            <div className="navContent">
              <SearchOutlinedIcon className="icon" />
              <span>Search</span>
            </div>
          </li>
          <li>
            <div className="navContent">
              <NavLink
                to="/explore"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <ExploreOutlinedIcon className="icon" />
                <span>Explore</span>
              </NavLink>
            </div>
          </li>

          <li onClick={handleOpen}>
            <div className="navContent">
              <AddBoxOutlinedIcon className="icon" />
              <span>Create</span>
            </div>
          </li>
          <li>
            <div className="navContent">
              <NavLink
                to={`/${authUser.username}`}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {authUser.profilePicURL ? (
                  <img
                    src={authUser.profilePicURL}
                    className="icon profile_img"
                  />
                ) : (
                  <PersonIcon className="icon" />
                )}
                <span>Profile</span>
              </NavLink>
            </div>
          </li>
        </ul>
      </div>
      <SidebarDrawer open={openSearchField} />
    </div>
  );
};

export default Sidebar;
