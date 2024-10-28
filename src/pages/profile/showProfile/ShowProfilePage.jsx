import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import "./showProfile.scss";

import { Box, ImageList, ImageListItem, Tab, Tabs } from "@mui/material";
import {
  AppsOutlined as AppsOutlinedIcon,
  Bookmarks as BookmarksIcon,
  AccountBoxOutlined as AccountBoxOutlinedIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

// import BookmarksIcon from '@mui/icons-material/Bookmarks';

import { Link, useParams } from "react-router-dom";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../firebase";

import FollowUnfollowButton from "../../../components/followUnfollowButton./FollowUnfollowButton";
import { useSelector } from "react-redux";
import PostList from "./PostList";
import BookmarkList from "./BookmarkList";
import TagList from "./TagList";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ShowProfilePage = () => {
  const { userName } = useParams();

  const authUser = useSelector((state) => state.login.user);

  const [userProfile, setUserProfile] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [totalPosts, setTotalPosts] = useState(authUser.posts.length);
  const [bookmarks, setBookmarks] = useState([]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    document.title = "profile | FakeInsta";
  }, []);

  useEffect(() => {
    const getProfileData = async () => {
      if (authUser && userName == authUser.username) {
        setUserProfile(authUser);
      } else {
        const profileQuery = query(
          collection(db, "users"),
          where("username", "==", userName)
        );
        try {
          const profileSnapshot = await getDocs(profileQuery);
          let profileData = {};
          profileSnapshot.forEach((doc) => {
            profileData = doc.data();
          });
          setUserProfile(profileData);
        } catch (e) {
          console.error("user not found");
        }
      }
    };
    getProfileData();
  }, [userName, authUser]);

  const fetchData = async (post) => {
    const docSnap = await getDoc(doc(db, "posts", post));

    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : {};
  };

  const fetchAllData = async () => {
    try {
      const fetchedData = await Promise.all(userProfile.posts.map(fetchData));
      setAllPosts(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    userProfile && fetchAllData() && fetchBookmarks();
  }, [userProfile]);

  const fetchBookmarks = async () => {
    const fetchSingleBookmark = async (postId) => {
      const postDocSnap = await getDoc(doc(db, "posts", postId));
      return postDocSnap.exists()
        ? { ...postDocSnap.data(), id: postDocSnap.id }
        : {};
    };

    const bookmarkPromises = authUser.bookmarks.map(fetchSingleBookmark);
    const bookmarkList = await Promise.all(bookmarkPromises);
    setBookmarks(bookmarkList);
  };

  return (
    <Layout>
      {userProfile ? (
        <div className="showProfile">
          <div className="top">
            <div className="left ">
              {userProfile.profilePicURL ? (
                <img src={userProfile.profilePicURL} className="profile_img" />
              ) : (
                <AccountCircleIcon className="profile_img" />
              )}
            </div>
            <div className="right">
              <div>
                <span className="font-semibold">{userProfile.username}</span>
                {authUser && userName == authUser.username ? (
                  <button type="button">
                    <Link to="/accounts/edit">Edit Profile</Link>
                  </button>
                ) : (
                  <FollowUnfollowButton userID={userProfile.uid} />
                )}
              </div>

              <div className="stat">
                <span>
                  {userProfile.posts.length || 0}{" "}
                  {userProfile.posts.length <= 1 ? "post" : "posts"}
                </span>
                <span>{userProfile.followers.length} followers</span>
                <span>{userProfile.following.length} following</span>
              </div>
              <div className="info">
                <p className="capitalize">{userProfile.fullName}</p>
                <p className="text-[0.8rem]">{userProfile.bio}</p>
                <p className="">
                  <a
                    className="text-[0.8rem] text-[#1877f2] font-medium "
                    target="_blank"
                    href={`${userProfile.website_url}`}
                  >
                    {userProfile.website_url}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <ul className="middle">
            <li>
              <b>{userProfile.posts.length}</b>
              {userProfile.posts.length <= 1 ? "post" : "posts"}
            </li>
            <li>
              <b>{userProfile.followers.length}</b>
              followers
            </li>
            <li>
              <b>{userProfile.following.length}</b>
              following
            </li>
          </ul>
          <Box sx={{ width: "100%" }} className="bottom">
            <Box
              sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                className="border-b border-[#434343]"
                sx={{
                  width: "100%",
                  color: "#a8a8a8",
                  maxHeight: "30px",
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "center",
                  },
                  "& .MuiTabs-indicator": { display: "none" },
                }}
              >
                {[
                  { icon: AppsOutlinedIcon, label: "POSTS" },
                  { icon: BookmarksIcon, label: "SAVED" },
                  { icon: AccountBoxOutlinedIcon, label: "TAGGED" },
                ].map((tab, index) => (
                  <Tab
                    key={tab.label}
                    label={
                      <div
                        className={`${
                          value === index
                            ? "text-white font-bold"
                            : "text-[#a8a8a8]"
                        } flex md:flex-row md:items-center md:space-x-1  `}
                      >
                        <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                        <span
                          className={`${
                            value === index
                              ? "text-white font-bold"
                              : "text-[#a8a8a8]"
                          } hidden md:inline`}
                          style={{
                            color: value === index ? "#f5f5f5" : "#a8a8a8",
                            fontWeight: value === index ? "bold" : "normal",
                          }}
                        >
                          {tab.label}
                        </span>
                      </div>
                    }
                    sx={{
                      py: 1,
                      minWidth: "100px",
                      width: "33%",

                      borderTop: value === index ? "2px solid white" : "none",
                      "& .MuiTab-iconWrapper": {
                        color: value === index ? "#f5f5f5" : "#a8a8a8",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <PostList allPosts={allPosts} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <BookmarkList bookmarks={bookmarks} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TagList />
            </CustomTabPanel>
          </Box>
        </div>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </Layout>
  );
};

export default ShowProfilePage;
