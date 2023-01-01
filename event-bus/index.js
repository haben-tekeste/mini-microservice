const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);
  try {
    await axios.post("http://posts-clusterip-srv:4000/events", event);
    await axios.post("http://comments-clusterip-srv:8080/events", event);
    await axios.post("http://moderation-clusterip-srv:4004/events", event);
    await axios.post("http://query-clusterip-srv:4005/events", event);
  } catch (error) {
    console.log("ERRO OCCURED !!!")
    console.log(error.message);
  }

  res.status(200).send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.status(201).send(events);
});

app.listen(4003, () => {
  console.log("Event bus running @ 4003");
});
