import { ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";

const PostList = ({ allPosts }) => {
  console.log("alllposts", allPosts);

  return (
    <div>
      <ImageList
        className="imageList z-0"
        cols={3}
        rowHeight="auto"
        gap={4}
        sx={{
          zIndex: 0,
          // border: "1px solid blue", // for testing an ui error
        }}
      >
        {allPosts &&
          allPosts.map((post) => (
            <ImageListItem key={post.id}>
              <Link to={`/p/${post.id}/`}>
                <img
                  srcSet={`${post.mediaURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${post.mediaURL}?w=164&h=164&fit=crop&auto=format`}
                  alt={post.mediaURL}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </ImageListItem>
          ))}
      </ImageList>
    </div>
  );
};

export default PostList;
