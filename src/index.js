const { initializeDatabase } = require("./db/db.connect");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const {
  fetchPosts,
  fetchPostById,
  updatePost,
  addCommentToPost,
  likePost,
  createPost,
} = require("./controllers/posts.controller");

const Post = require("./models/post.model");
const User = require("./models/users.model");
const mongoose = require("mongoose");
const {
  fetchUsers,
  fetchUserByName,
  updateUser,
} = require("./controllers/users.controller");

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

    if (response.posts.length === 0) {
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

    if (!response.post) {
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
    if (!response.post) {
      return res.status(404).json({ message: "No Post Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// To add comment
app.post("/api/v1/comment/:id", async (req, res) => {
  try {
    const comment = req.body;
    if (
      !comment.text ||
      !comment.username ||
      !comment.firstName ||
      !comment.lastName ||
      !comment.avatarURL
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedPost = await addCommentToPost(req.params.id, comment);

    if (!updatedPost) {
      return res.status(400).json({ message: "No Post Found" });
    }

    res.status(201).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//to add post
app.post("/api/v1/post", async (req, res) => {
  try {
    const response = await createPost(req.body);

    if (!response) {
      return res.status(400).json({ message: "Somthing went wrong" });
    }
    res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// To like post
app.post("/api/v1/like/:id", async (req, res) => {
  try {
    const liked = req.body;
    const id = req.params.id;
    const updatedPost = await likePost(liked, id);

    res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// User APIs
app.get("/api/v1/users", async (req, res) => {
  try {
    const response = await fetchUsers();
    if (response.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/users/:username", async (req, res) => {
  try {
    const response = await fetchUserByName(req.params.username);
    if (!response) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/following/:id", async (req, res) => {
  try {
    const response = await updateUserFollowing(req.params.id, req.body);
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: response,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/followers/:id", async (req, res) => {
  try {
    const response = await updateUserFollowers(req.params.id, req.body);
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: response,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server connected to port http://localhost:${PORT}`);
});
