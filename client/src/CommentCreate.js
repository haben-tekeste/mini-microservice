import React, { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault()
    await axios.post(`http://localhost:8080/posts/${postId}/comments`, {
      content,
    });
    setContent("");
  };
  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="">New Comment</label>
          <input
            type="text"
            name=""
            id=""
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
