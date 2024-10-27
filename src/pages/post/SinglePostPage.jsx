import Layout from "../../components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

import SinglePost from "../../components/post/SinglePost";
import { useEffect } from "react";

const SinglePostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Post | FakeInsta";
  }, []);

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
          <SinglePost postId={postId} />
        </div>
      </div>
    </Layout>
  );
};

export default SinglePostPage;
