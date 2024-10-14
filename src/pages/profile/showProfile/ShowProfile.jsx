import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import "./showProfile.scss";

import { ImageList, ImageListItem } from "@mui/material";
import {
  AppsOutlined as AppsOutlinedIcon,
  BookmarkBorderOutlined as BookmarkBorderOutlinedIcon,
  AccountBoxOutlined as AccountBoxOutlinedIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

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
import UserContext from "../../../context/UserContext";
import FollowUnfollowButton from "../../../components/followUnfollowButton./FollowUnfollowButton";

const ShowProfile = () => {
  const { userName } = useParams();
  const { authUser } = useContext(UserContext);

  const [userProfile, setUserProfile] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [totalPosts, setTotalPosts] = useState(authUser.posts.length);

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
    const docRef = doc(db, "posts", post);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    } else {
      console.log("No such document!");
      return null;
    }
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
    userProfile && fetchAllData();
  }, [userProfile]);

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
                  {userProfile.posts.length}{" "}
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
          <div className="bottom">
            <ul className="links">
              <li className=" link active">
                <AppsOutlinedIcon className="icon" />
                <span>POSTS</span>
              </li>
              <li className=" link ">
                <BookmarkBorderOutlinedIcon className="icon" />
                <span>SAVED</span>
              </li>
              <li className=" link ">
                <AccountBoxOutlinedIcon className="icon" />
                <span>TAGGED</span>
              </li>
            </ul>
            <ImageList className="imageList z-0" cols={3} rowHeight="auto">
              {allPosts &&
                allPosts.map((post) => (
                  <ImageListItem key={post.id}>
                    <Link to={`/p/${post.id}/`}>
                      <img
                        srcSet={`${post.mediaURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${post.mediaURL}?w=164&h=164&fit=crop&auto=format`}
                        alt={post.mediaURL}
                        loading="lazy"
                      />
                    </Link>
                  </ImageListItem>
                ))}
            </ImageList>
          </div>
        </div>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </Layout>
  );
};

export default ShowProfile;
