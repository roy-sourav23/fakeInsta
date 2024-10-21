import "./footer.scss";
// import "./footer.css";
import React, { useState } from "react";
import {
  HomeOutlined as HomeOutlinedIcon,
  ExploreOutlined as ExploreOutlinedIcon,
  AddBoxOutlined as AddBoxOutlinedIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { Link, NavLink } from "react-router-dom";
import PostModal from "../postModal/PostModal";
import { useSelector } from "react-redux";

const Footer = () => {
  const authUser = useSelector((state) => state.login.user);

  const [openModal, setOpenModal] = useState(false);

  // modal1 open & close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="footer">
      <PostModal open={openModal} handleClose={handleCloseModal} />

      <ul className="iconList ">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <HomeOutlinedIcon className="icon" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <ExploreOutlinedIcon className="icon" />
          </NavLink>
        </li>

        <li>
          <div onClick={handleOpenModal}>
            <AddBoxOutlinedIcon className="icon" />
          </div>
        </li>

        <li>
          <NavLink
            to={`/${authUser?.username}`}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <PersonIcon className="icon" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
