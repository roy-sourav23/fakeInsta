import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import FeedPost from "./FeedPost";
import { useSelector } from "react-redux";

const FeedPosts = () => {
  const authUser = useSelector((state) => state.login.user);

  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFeedPostsByUser = async (userID) => {
    const feedPostsRef = collection(db, "posts");
    const allPosts = [];
    const q = query(feedPostsRef, where("createdBy", "==", userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allPosts.push({ id: doc.id, ...doc.data() });
    });
    return allPosts;
  };

  const getFeedPosts = async () => {
    let allFeedPosts = [];
    const userPostsPromises = authUser.following.map(async (userID) => {
      const userData = await getFeedPostsByUser(userID);
      allFeedPosts = [...allFeedPosts, ...userData];
    });

    await Promise.all(userPostsPromises);
    return allFeedPosts;
  };

  useEffect(() => {
    const fetchFeedPosts = async () => {
      const allFeedPosts = await getFeedPosts();
      setFeedPosts(allFeedPosts);
      setLoading(false);
    };

    authUser.following.length > 0 && fetchFeedPosts();
  }, []);

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
      {feedPosts.map((post) => {
        return <FeedPost key={post.id} post={post} />;
      })}
    </div>
  );
};

export default FeedPosts;
