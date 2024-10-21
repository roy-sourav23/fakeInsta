import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom";

const ExplorePage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const shuffleArr = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const getAllPosts = async () => {
    let allPostsData = [];
    const querySnapshot = await getDocs(collection(db, "posts"));

    querySnapshot.forEach((doc) => {
      allPostsData.push({ postId: doc.id, ...doc.data() });
    });

    return allPostsData;
  };

  useEffect(() => {
    const enterData = async () => {
      const data = await getAllPosts();
      const shuffledArray = shuffleArr(data);
      setAllPosts(shuffledArray);
      setIsLoading(false);
    };
    enterData();
  }, []);

  // console.log("data", allPosts);

  if (isLoading) {
    return (
      <Layout>
        <p>...loading</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* <h1
          style={{
            color: "white",
            padding: "1rem",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          Explore page
        </h1> */}

        <ImageList
          className="imageList z-0 mt-8"
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
                <Link to={`/p/${post.postId}/`}>
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
    </Layout>
  );
};

export default ExplorePage;
