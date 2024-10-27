import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

import {
  MoreHoriz as MoreHorizIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

import SinglePostActionsComp from "../../components/post/SinglePostActionsComp";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import ShowComments from "./ShowComments";

const SinglePost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [postCreator, setPostCreator] = useState(null);
  const authUser = useSelector((state) => state.login.user);
  const [comments, setComments] = useState([]);

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

      await getPostCreatorInfo(data.createdBy);
      setComments(data.comments);
    };

    getDetails();
  }, []);

  const commentInputRef = useRef(null);
  const handleFocusCommentInput = () => {
    commentInputRef.current.focus();
  };

  const getCommentData = async () => {
    const docSnap = await getDoc(doc(db, "posts", postId));

    if (docSnap.exists()) {
      setComments(docSnap.data().comments);
    }
  };

  const handleAddComment = async () => {
    const commentData = {
      id: crypto.randomUUID(),
      postId: postId,
      text: formik.values.comment,
      createdBy: authUser.username,
      profilePicURL: authUser.profilePicURL,
    };

    // add the comment to the specific post document
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(commentData),
    });
    getCommentData();
  };

  const handleDeleteComment = async (id) => {
    const foundComment = comments.find((comment) => comment.id === id);

    if (foundComment) {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayRemove(foundComment),
      });

      getCommentData();
    }
  };

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    onSubmit: async () => {
      handleAddComment();
      formik.resetForm();
    },
  });

  // skeleton
  // if (!(postCreator && post)) {
  //   return (
  //     <div className="mb-12  max-w-[560px] border-b border-[#434343] pb-4 mx-auto">
  //       <div className="postHeader flex items-center justify-between p-2">
  //         <div className="flex items-center gap-2 py-1">
  //           <AccountCircleIcon className="profile_img" />

  //           <p className="text-[f5f5f5] text-[0.9rem] font-medium hover:text-[#0095f6] bg-red-400 h-[20px] w-[200px]">
  //             {/* <Link to={`/${postCreator.username}`}>
  //           {postCreator.username}
  //         </Link> */}
  //           </p>
  //         </div>

  //         <div>
  //           <MoreHorizIcon />
  //         </div>
  //       </div>
  //       <div className="mediaContainer w-full h-auto border border-[#434343]  ">
  //         <div className="h-[300px] w-[450px] bg-red-400"></div>
  //         {/* <img
  //       src={post.mediaURL}
  //       className="w-full max-w-[450px] h-full object-contain  mx-auto"
  //     /> */}
  //       </div>
  //       <div className="postFooter py-2 flex flex-col w-full items-start">
  //         {/* <SinglePostActionsComp postId={postId} post={post} /> */}

  //         <p>
  //           <span className="text-[f5f5f5] text-[0.9rem] font-medium pr-3 h-[20px] w-[200px] bg-red-400">
  //             {/* {postCreator.username} */}
  //           </span>

  //           <span className="text-[f5f5f5] text-[0.82rem] h-[20px] w-[200px] bg-red-400"></span>
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!(postCreator && post)) {
    return <p>posts loading...</p>;
  }

  return (
    <div>
      <div className="mb-12  max-w-[560px]  pb-4 mx-auto">
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
            className="w-full max-w-[450px] max-h-[350px] object-contain  mx-auto"
          />
        </div>
        <div className="postFooter py-2 flex flex-col w-full items-start">
          <SinglePostActionsComp
            postId={postId}
            post={post}
            handleFocusCommentInput={handleFocusCommentInput}
          />

          <p className="mb-2">
            <span className="text-[f5f5f5] text-[0.9rem] font-medium pr-3 ">
              {postCreator.username}
            </span>

            <span className="text-[f5f5f5] text-[0.82rem]">{post.caption}</span>
          </p>

          {comments.length > 0 ? (
            <ShowComments
              comments={comments}
              handleDeleteComment={handleDeleteComment}
            />
          ) : null}

          <div
            style={{ width: "100%", padding: "1rem 0" }}
            className=" border-t border-[#434343]"
          >
            <form
              onSubmit={formik.handleSubmit}
              style={{
                width: "100%",
                display: "flex",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              {/* <AddCommentIcon fontSize="small" /> */}
              <div className="w-[1.75rem] h-[1.75rem]">
                {authUser.profilePicURL ? (
                  <img
                    src={authUser.profilePicURL}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <AccountCircleIcon className="profile_img" />
                )}
              </div>
              <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Add a comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                ref={commentInputRef}
                style={{
                  background: "black",
                  outline: "none",
                  color: "white",
                  width: "77%",
                  fontSize: "14px",
                  margin: "0 0.7rem",
                }}
              />
              <Button
                variant="outlined"
                type="submit"
                sx={{ fontSize: "12px" }}
              >
                Post
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
