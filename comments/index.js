const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");
const { stat } = require("fs");

const app = express();

const commentsByPostId = {};

app.use(cors());
app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.status(201).send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comments = commentsByPostId[id] || [];
  const commentId = randomBytes(4).toString("hex");
  comments.push({
    id: commentId,
    content,
    status: "pending",
  });
  commentsByPostId[id] = comments;
  await axios.post("http://localhost:4003/events", {
    type: "Comment Created",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send(commentsByPostId[id]);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "Comment Moderated") {
    const { id, status, postId, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((cm) => id === cm.id);
    comment.status = status;
    await axios.post("http://localhost:4003/events", {
      type: "Comment Updated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }
  console.log("Event recieved: ", type);
  res.send({});
});

app.listen(8080, () => {
  console.log("Comments running @ port 8080");
});
