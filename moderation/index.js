const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "Comment Created") {
    const { id, content, postId } = data;
    let newstatus = content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://localhost:4003/events", {
      type: "Comment Moderated",
      data: {
        id,
        content,
        status: newstatus,
        postId,
      },
    });
  }

  return res.send({});
});

app.listen(4004, () => {
  console.log("Moderation running @4004");
});
