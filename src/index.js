const { initializeDatabase } = require("./db/db.connect");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const {
  fetchPosts,
  fetchPostById,
  updatePost,
} = require("./controllers/posts.controller");
const Post = require("./models/post.model");
const mongoose = require("mongoose");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
initializeDatabase();

app.get("/api/v1/posts", async (req, res) => {
  try {
    const response = await fetchPosts();

    if (response.length === 0) {
      return res.status(404).json({ message: "No Posts Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/post/:id", async (req, res) => {
  try {
    const response = await fetchPostById(req.params.id);

    if (!response) {
      return res.status(404).json({ message: "No Post Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/post/:id", async (req, res) => {
  try {
    const response = await updatePost(req.params.id, req.body);
    if (!response) {
      return res.status(404).json({ message: "No Post Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server connected to port http://localhost:${PORT}`);
});
