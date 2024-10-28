import React, { useEffect, useState } from "react";
import {
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  SendOutlined as SendOutlinedIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineOutlinedIcon,
  BookmarkBorderOutlined as BookmarkBorderOutlinedIcon,
  Bookmark as BookmarkIcon,
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

import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import { userUpdated } from "../../redux/loginSlice";

const SinglePostAction = ({ postId, post, handleFocusCommentInput }) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isBookmarkedByUser, setIsBookmarkedByUser] = useState(false);
  const authUser = useSelector((state) => state.login.user);
  const currentUserId = authUser.uid;
  const dispatch = useDispatch();

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

    const isPostBookmarkedByCurrentUser = async () => {
      const usersRef = collection(db, "users");

      // Query the specific post where likes array contains the current user
      const q = query(
        usersRef,
        where(documentId(), "==", authUser.uid),
        where("bookmarks", "array-contains", postId)
      );

      const querySnapshot = await getDocs(q);

      // Check if we have a matching document
      let isBookmarked = false;
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          isBookmarked = true;
        }
      });

      return isBookmarked;
    };

    const checkBookmarkStatus = async () => {
      const bookmarked = await isPostBookmarkedByCurrentUser();
      setIsBookmarkedByUser(bookmarked);
    };

    checkLikeStatus();
    checkBookmarkStatus();
  }, [postId, currentUserId]);

  const getPostInfo = async () => {
    const postRef = doc(db, "posts", postId);
    const postDocSnap = await getDoc(postRef);
    const postData = postDocSnap.data();
    setCurrentPost(postData);
    return postData;
  };

  const addLike = async (postId) => {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: arrayUnion(currentUserId),
    });
  };

  const Removelike = async (postId) => {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: arrayRemove(currentUserId),
    });
  };

  const handleLike = async (e) => {
    if (isLikedByUser) {
      await Removelike(postId);
      setIsLikedByUser(false);
    } else {
      await addLike(postId);
      setIsLikedByUser(true);
    }
    getPostInfo();
  };

  const addBookmark = async (postId) => {
    const userRef = doc(db, "users", authUser.uid);

    await updateDoc(userRef, {
      bookmarks: arrayUnion(postId),
    });
  };

  const RemoveBookmark = async (postId) => {
    const userRef = doc(db, "users", authUser.uid);

    await updateDoc(userRef, {
      bookmarks: arrayRemove(postId),
    });
  };

  const handleBookmark = async (e) => {
    if (isBookmarkedByUser) {
      await RemoveBookmark(postId);
      setIsBookmarkedByUser(false);
    } else {
      await addBookmark(postId);
      setIsBookmarkedByUser(true);
    }
    dispatch(userUpdated(authUser.uid));
  };

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
        <div style={{ cursor: "pointer" }} onClick={handleBookmark}>
          {isBookmarkedByUser ? (
            <BookmarkIcon />
          ) : (
            <BookmarkBorderOutlinedIcon />
          )}
        </div>
      </div>
      <p className="p-2 text-[0.9rem] font-medium">
        {currentPost?.likes?.length || 0}{" "}
        {currentPost?.likes?.length < 2 ? "like" : "likes"}{" "}
      </p>
    </div>
  );
};

export default SinglePostAction;
