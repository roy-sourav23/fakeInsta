import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

import {
  ArrowBack as ArrowBackIcon,
  MoreHoriz as MoreHorizIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import SinglePostActionsComp from "../../components/post/SinglePostActionsComp";

const SinglePostPage = () => {
  // const authUser = useSelector((state) => state.login.user);

  const { postId } = useParams();
  // console.log("postID", postId);

  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [postCreator, setPostCreator] = useState(null);

  useEffect(() => {
    document.title = "Post | FakeInsta";
  }, []);

  useEffect(() => {
    const getPostInfo = async () => {
      const postRef = doc(db, "posts", postId);
      const postDocSnap = await getDoc(postRef);
      const postData = postDocSnap.data();
      setPost(postData);
      return postData;
    };
    // we will get this userId from getPostInfo function
    const getPostCreatorInfo = async (userId) => {
      const postCreatorRef = doc(db, "users", userId);
      const postCreatorDocSnap = await getDoc(postCreatorRef);
      const postCreatorData = postCreatorDocSnap.data();
      setPostCreator(postCreatorData);
    };

    const getDetails = async () => {
      const data = await getPostInfo();

      getPostCreatorInfo(data.createdBy);
    };

    getDetails();
  }, []);

  // console.log("post", post);
  // console.log("postCreator", postCreator);

  return (
    <Layout>
      <div>
        <div className="postContainer text-[#f5f5f5] pt-7">
          <p
            className="text-[0.9rem] font-medium pl-6 py-3 cursor-pointer hover:text-[#3c8aef] hover:underline max-w-max"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
            return
          </p>
          {postCreator && post ? (
            <div className="mb-12  max-w-[560px] border-b border-[#434343] pb-4 mx-auto">
              <div className="postHeader flex items-center justify-between p-2">
                <div className="flex items-center gap-2 py-1">
                  <Link to={`/${postCreator.username}`}>
                    {postCreator.profilePicURL ? (
                      <img
                        src={postCreator.profilePicURL}
                        className="w-[2.25rem] h-[2.25rem] rounded-full object-cover"
                      />
                    ) : (
                      <AccountCircleIcon className="profile_img" />
                    )}
                  </Link>

                  <p className="text-[f5f5f5] text-[0.9rem] font-medium hover:text-[#0095f6]">
                    <Link to={`/${postCreator.username}`}>
                      {postCreator.username}
                    </Link>
                  </p>
                </div>

                <div>
                  <MoreHorizIcon />
                </div>
              </div>
              <div className="mediaContainer w-full h-auto border border-[#434343]">
                <img
                  src={post.mediaURL}
                  className="w-full max-w-[450px] h-full object-contain  mx-auto"
                />
              </div>
              <div className="postFooter py-2 flex flex-col w-full items-start">
                <SinglePostActionsComp postId={postId} post={post} />

                <p>
                  <span className="text-[f5f5f5] text-[0.9rem] font-medium pr-3">
                    {postCreator.username}
                  </span>

                  <span className="text-[f5f5f5] text-[0.82rem]">
                    {post.caption}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p>post not found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SinglePostPage;
