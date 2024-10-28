import React from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Link } from "react-router-dom";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";

const ShowComments = ({ comments, handleDeleteComment }) => {
  const authUser = useSelector((state) => state.login.user);
  return (
    <div style={{ width: "100%" }}>
      <p>Comments</p>
      {comments.map((comment) => {
        return (
          <div
            key={comment.id}
            style={{
              padding: "0.5rem 0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              {comment.profilePicURL ? (
                <img
                  src={comment.profilePicURL}
                  className="w-[1.75rem] h-[1.75rem] rounded-full object-cover"
                />
              ) : (
                <AccountCircleIcon className="profile_img" />
              )}
              <Link
                to={`/${comment.createdBy}`}
                style={{ fontWeight: "500", padding: "0 0.5rem" }}
              >
                {comment.createdBy}
              </Link>
              &middot;
              <span style={{ fontSize: "13.5px", padding: "0 0.5rem" }}>
                {comment.text}
              </span>
            </div>
            {comment.createdBy === authUser.username ? (
              <div
                onClick={() => handleDeleteComment(comment.id)}
                style={{ cursor: "pointer" }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ShowComments;
