import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import FeedPost from "./FeedPost";
import { useSelector } from "react-redux";

const FeedPosts = () => {
  const authUser = useSelector((state) => state.login.user);

  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSinglePostData = async (postID) => {
    const postRef = doc(db, "posts", postID);
    const postSnap = await getDoc(postRef);

    // let postData = null;
    if (postSnap.exists()) {
      return { postID: postID, ...postSnap.data() };
    }
    return {};
  };

  const postsPerFollowing = async (userID) => {
    const userDocRef = doc(db, "users", userID);
    const userDocSnap = await getDoc(userDocRef);

    let posts = null;
    let postData = [];
    if (userDocSnap.exists()) {
      posts = userDocSnap.data().posts;
      const postsPromise = await posts.map(async (postID) => {
        const data = await getSinglePostData(postID);
        postData = [...postData, data];
        return data;
      });

      await Promise.all(postsPromise);
      // console.log("postData", postData);

      // console.log("posts", posts);
    } else {
      console.log("no posts");
    }
    return postData;
  };

  const getAllPosts = async () => {
    const followingList = authUser.following;

    let postList = [];
    const postListPromise = await followingList.map(async (userID) => {
      const posts = await postsPerFollowing(userID);
      postList = [...postList, ...posts];
      return posts;
    });

    await Promise.all(postListPromise);
    // console.log("x", postList);
    return postList;
  };

  useEffect(() => {
    const fetchFeedPosts = async () => {
      const allFeedPosts = await getAllPosts();
      setFeedPosts(allFeedPosts);
      setLoading(false);
    };
    authUser.following.length > 0 && fetchFeedPosts();

    // getAllPosts();
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

  // console.log("feedPosts", feedPosts);

  return (
    <div className=" max-w-[540px] mx-auto ">
      {feedPosts &&
        feedPosts.map((post) => {
          return <FeedPost key={post.id} post={post} postId={post.postID} />;
        })}
    </div>
    // <div></div>
  );
};

export default FeedPosts;
