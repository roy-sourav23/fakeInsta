import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  MoreHoriz as MoreHorizIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import SinglePostActionsComp from "../post/SinglePostActionsComp";

const FeedPost = ({ post, postId }) => {
  const [postCreator, setPostCreator] = useState(null);
  const postCreatorID = post.createdBy;

  useEffect(() => {
    const getPostCreatorInfo = async () => {
      const userRef = doc(db, "users", postCreatorID);
      const userDocSnap = await getDoc(userRef);
      const userData = userDocSnap.data();
      setPostCreator(userData);
    };
    getPostCreatorInfo();
  }, [post]);

  return (
    <>
      {postCreator && (
        <div className="mb-12  max-w-[540px] border-b border-[#434343] pb-4">
          <div className="postHeader flex items-center justify-between p-2">
            <div className="flex items-center gap-2 py-1">
              <Link to={`/${postCreator.username}`}>
                {postCreator.profilePicURL ? (
                  <img
                    src={postCreator.profilePicURL}
                    className="w-[2.25rem] h-[2.25rem] rounded-full object-cover"
                  />
                ) : (
                  <AccountCircleIcon />
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
              className="w-full max-w-[450px] h-full max-h-[300px] object-contain  mx-auto"
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
      )}
    </>
  );
};

export default FeedPost;
