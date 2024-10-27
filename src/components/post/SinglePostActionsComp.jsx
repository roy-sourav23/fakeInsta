import React, { useEffect, useState } from "react";
import {
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  SendOutlined as SendOutlinedIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineOutlinedIcon,
  BookmarkBorderOutlined as BookmarkBorderOutlinedIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { useSelector } from "react-redux";
import { db } from "../../../firebase";

const SinglePostActionComp = ({ postId, post, handleFocusCommentInput }) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  // const [isPostBookmarked, setPostBookmarked] = useState(false);
  const authUser = useSelector((state) => state.login.user);
  const currentUserId = authUser.uid;

  useEffect(() => {
    const isPostLikedByCurrentUser = async () => {
      const postsRef = collection(db, "posts");

      // Query the specific post where likes array contains the current user
      const q = query(
        postsRef,
        where(documentId(), "==", postId),
        where("likes", "array-contains", currentUserId)
      );

      const querySnapshot = await getDocs(q);

      // Check if we have a matching document
      let isLiked = false;
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          isLiked = true;
        }
      });

      return isLiked;
    };
    const checkLikeStatus = async () => {
      const liked = await isPostLikedByCurrentUser();
      setIsLikedByUser(liked);
    };

    checkLikeStatus();
  }, [postId, currentUserId]);

  const getPostInfo = async () => {
    const postRef = doc(db, "posts", postId);
    const postDocSnap = await getDoc(postRef);
    const postData = postDocSnap.data();
    setCurrentPost(postData);
    return postData;
  };

  const doLike = async (postId) => {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: arrayUnion(currentUserId),
    });
  };

  const doUnlike = async (postId) => {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: arrayRemove(currentUserId),
    });
  };

  const handleLike = async (e) => {
    if (isLikedByUser) {
      await doUnlike(postId);
      setIsLikedByUser(false);
    } else {
      await doLike(postId);
      setIsLikedByUser(true);
    }
    getPostInfo();
  };

  const handleBookmark = async (e) => {};

  return (
    <div className="py-2 flex flex-col w-full items-start">
      <div className="flex items-center justify-between w-full py-2">
        <div className="flex items-center gap-3">
          <div onClick={handleLike} style={{ cursor: "pointer" }}>
            {isLikedByUser ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
          </div>
          <div onClick={handleFocusCommentInput} style={{ cursor: "pointer" }}>
            <ChatBubbleOutlineOutlinedIcon />
          </div>
          <SendOutlinedIcon />
        </div>
        <div>
          <BookmarkBorderOutlinedIcon />
        </div>
      </div>
      <p className="p-2 text-[0.9rem] font-medium">
        {currentPost?.likes?.length || 0}{" "}
        {currentPost?.likes?.length < 2 ? "like" : "likes"}{" "}
      </p>
    </div>
  );
};

export default SinglePostActionComp;
