import React, { useState, useEffect } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState({});
  const fetchPosts = async () => {
    const { data } = await axios.get("http://localhost:4005/posts");
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const renderedPost = Object.values(posts).map((post) => (
    <div
      className="card"
      style={{ width: "30%", marginBottom: "20px" }}
      key={post?.id}
    >
      <div className="card-body">
        <h3>{post?.title}</h3>
        <CommentList comments={post.comments} />
        <CommentCreate postId={post.id} />
      </div>
    </div>
  ));
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPost}
    </div>
  );
};

export default PostList;
