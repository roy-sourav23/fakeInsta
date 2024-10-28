import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../../firebase.js";
import { useDispatch, useSelector } from "react-redux";
import { userUpdated } from "../../redux/loginSlice.js";

const FollowUnfollowButton = ({ userID }) => {
  const authUser = useSelector((state) => state.login.user);
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!authUser || !authUser.uid) {
        console.error("authUser is not defined or missing uid");
        return;
      }

      const currentUserRef = doc(db, "users", authUser.uid);

      try {
        const currentUserDoc = await getDoc(currentUserRef);
        if (currentUserDoc.exists()) {
          const currentUserData = currentUserDoc.data();
          const isFollowing =
            currentUserData.following &&
            currentUserData.following.includes(userID);
          setIsFollowing(isFollowing);
        }
      } catch (error) {
        console.error("Error checking if following:", error);
      }
    };

    checkIfFollowing();
  }, [authUser, userID]);

  const handleFollowUnfollow = async () => {
    if (!authUser || !authUser.uid) {
      console.error("authUser is not defined or missing uid");
      return;
    }

    const currentUserRef = doc(db, "users", authUser.uid);
    const anotherUserRef = doc(db, "users", userID);

    try {
      const currentUserDoc = await getDoc(currentUserRef);
      if (!currentUserDoc.exists()) {
        console.error("Current user document does not exist");
        return;
      }

      const currentUserData = currentUserDoc.data();

      const isFollowing =
        currentUserData.following && currentUserData.following.includes(userID);

      await updateDoc(currentUserRef, {
        following: isFollowing ? arrayRemove(userID) : arrayUnion(userID),
      });

      await updateDoc(anotherUserRef, {
        followers: isFollowing
          ? arrayRemove(authUser.uid)
          : arrayUnion(authUser.uid),
      });

      setIsFollowing(!isFollowing);
      dispatch(userUpdated(authUser.uid));
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }

    dispatch(userUpdated(authUser.uid));
  };

  return (
    <button
      onClick={handleFollowUnfollow}
      type="button"
      className={` ${
        isFollowing ? "bg-[#575656]" : "bg-[#0095f6]"
      } hover:bg-[#1877f2] text-[#f7f5f5] px-3 py-1 rounded text-xs`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowUnfollowButton;
