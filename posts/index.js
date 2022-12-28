const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

const postsById = {};

app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.status(201).send(postsById);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");

  postsById[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4003/events", {
    type: "Post Created",
    data: {
      id,
      title,
    },
  });
  res.status(201).send(postsById[id]);
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log("Event recieved: ", type);
  res.send({});
});

app.listen(4000, () => {
  console.log("Posts Running @ port 4000 !!!");
});
