import "./footer.scss";
import React, { useContext, useState } from "react";
import {
  HomeOutlined as HomeOutlinedIcon,
  ExploreOutlined as ExploreOutlinedIcon,
  MovieOutlined as MovieOutlinedIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineOutlinedIcon,
  AddBoxOutlined as AddBoxOutlinedIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import PostModal from "../postModal/PostModal";
import UserContext from "../../context/UserContext";

const Footer = () => {
  const { authUser } = useContext(UserContext);
  // console.log("authUser", authUser);

  const [openModal, setOpenModal] = useState(false);

  // modal1 open & close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="footer">
      <PostModal open={openModal} handleClose={handleCloseModal} />

      <ul className="iconList ">
        <li>
          <Link to="/">
            <div>
              <HomeOutlinedIcon className="icon" />
            </div>
          </Link>
        </li>
        <li>
          <div>
            <ExploreOutlinedIcon className="icon" />
          </div>
        </li>
        <li>
          <div>
            <MovieOutlinedIcon className="icon" />
          </div>
        </li>
        <li>
          <div onClick={handleOpenModal}>
            <AddBoxOutlinedIcon className="icon" />
          </div>
        </li>
        <li>
          <div>
            <ChatBubbleOutlineOutlinedIcon className="icon" />
          </div>
        </li>
        <li>
          <Link to={`/${authUser?.username}`}>
            <div>
              <PersonIcon className="icon" />
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
