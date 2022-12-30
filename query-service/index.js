const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};
// posts = { "123":{ postid: '', title :'', comments:[]} }

const handleEvents = (type, data) => {
  console.log(type, data);
  if (type === "Post Created") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "Comment Created") {
    const { id, content, postId, status } = data;

    posts[postId].comments.push({
      id,
      content,
      status,
    });
  }

  if (type === "Comment Updated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comments = post.comments;
    const comment = comments.find((cm) => id === cm.id);
    comment.status = status;
    comment.content = content;
  }
};

app.post("/events", (req, res) => {
  const { type } = req.body;
  handleEvents(type, req.body.data);
  res.status(200).send({});
});

app.get("/posts", (req, res) => {
  res.status(201).send(posts);
});

app.listen(4005, async () => {
  console.log("Query Service running @ 4005");
  const { data } = await axios.get("http://event-bus-srv:4003/events");
  data.forEach((event) => {
    console.log("Processing event ", event);
    handleEvents(event.type, event.data);
  });
});
