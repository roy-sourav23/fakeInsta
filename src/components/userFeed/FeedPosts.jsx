import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import FeedPost from "./FeedPost";
import { useSelector } from "react-redux";

const FeedPosts = () => {
  const authUser = useSelector((state) => state.login.user);

  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSinglePostData = async (postID) => {
    const postSnap = await getDoc(doc(db, "posts", postID));
    return postSnap.exists() ? { postID: postID, ...postSnap.data() } : null;
  };

  const getPostsByUser = async (userID) => {
    const userDocSnap = await getDoc(doc(db, "users", userID));

    if (!userDocSnap.exists()) return [];

    const posts = userDocSnap.data().posts || [];
    return await Promise.all(posts.map(getSinglePostData));
  };

  const getAllPosts = async () => {
    const postPromises = authUser.following.map(getPostsByUser);
    const postList = await Promise.all(postPromises);

    return postList.flat();
  };

  useEffect(() => {
    const fetchFeedPosts = async () => {
      const allFeedPosts = await getAllPosts();
      setFeedPosts(allFeedPosts);
      setLoading(false);
    };
    if (authUser.following.length > 0) {
      fetchFeedPosts();
    }
  }, [authUser.following]);

  if (authUser.following.length == 0) {
    return (
      <p className="text-center  py-5 text-[#f5f5f5]">
        Follow someone to see posts
      </p>
    );
  }

  if (loading) {
    return <p className="text-center  py-5 text-[#f5f5f5]">Posts loading...</p>;
  }

  return (
    <div className=" max-w-[540px] mx-auto ">
      {feedPosts &&
        feedPosts.map((post) => {
          return <FeedPost key={post.id} post={post} postId={post.postID} />;
        })}
    </div>
  );
};

export default FeedPosts;
