import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, where, query } from "firebase/firestore";
import {
  SearchOutlined as SearchOutlinedIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { db } from "../../../firebase.js";

import "./header.scss";
import FollowUnfollowButton from "../followUnfollowButton./FollowUnfollowButton.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout, userUpdated } from "../../redux/loginSlice.js";

const HeaderDrawer = ({ open, user }) => {
  const authUser = useSelector((state) => state.login.user);

  return (
    <div
      className={`h-[100px] w-full absolute ${
        open ? "flex " : "hidden"
      } z-10 mt-1 bg-[#201f1f] text-[#a8a8a8] rounded`}
    >
      {user ? (
        <div className="px-2">
          <small>results</small>
          <div className="bg-[#212020] py-2 px-3 zrounded flex items-center justify-between text-sm gap-3">
            <div className="flex items-center gap-5">
              <img
                src={user.profilePicURL}
                className="w-[40px] h-[40px] object-cover rounded-full"
              />
              <p>
                <Link
                  to={`/${user.username}`}
                  className="cursor-pointer hover:text-[#0095f6]"
                >
                  {user.username}
                </Link>
              </p>
            </div>
            {authUser && authUser.username != user.username && (
              <FollowUnfollowButton userID={user.uid} />
            )}
          </div>
        </div>
      ) : (
        !user &&
        open && <p className="py-4 mx-auto text-sm">user does not exist!</p>
      )}
    </div>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [searchField, setSearchField] = useState("");
  const formRef = useRef(null);

  const authUser = useSelector((state) => state.login.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserByUsername = async (username) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return null;
  };

  const handleChange = (e) => {
    setSearchField(e.target.value);
    if (e.target.value.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await getUserByUsername(searchField);
    setFoundUser(user);
    formRef.current.reset();

    dispatch(userUpdated(authUser.uid));
  };

  const handleLogout = (e) => {
    dispatch(logout());
    navigate("/accounts/login");
  };

  return (
    <div className="header">
      <div className="logo">FakeInsta</div>
      <div className="iconList ">
        <div className="relative">
          <form ref={formRef} onSubmit={handleSubmit}>
            <label>
              <SearchOutlinedIcon />
              <input
                type="text"
                name="searchField"
                id=""
                value={searchField}
                onChange={handleChange}
                placeholder="Search"
              />
            </label>
          </form>
          <HeaderDrawer open={open} user={foundUser} />
        </div>
        <div className="icon ">
          <LogoutIcon onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Header;
