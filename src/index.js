const { initializeDatabase } = require("./db/db.connect");
require("dotenv").config();
const upload = require("../middlewares/multer.middleware");
const express = require("express");
const app = express();
const cors = require("cors");

const {
  fetchPosts,
  fetchPostById,
  updatePost,
  addCommentToPost,
  toggleLike,
  createPost,
  editPost,
  deletePost,
  editPostAvatar,
} = require("./controllers/posts.controller");

const {
  fetchUsers,
  fetchUserByName,
  updateUser,
  updateUserFollowing,
  updateUserFollowers,
  unFollowUser,
  updateProfile,
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

/* app.post("/api/v1/posts/:firstName", async (req, res) => {
  console.log(req.params.firstName, req.body);
  console.log("Updating posts for firstName:", firstName);
  try {
    // Update posts where the firstName matches the one in the params

    const response = await updatePostByfirstName(
      req.params.firstName,
      req.body
    );

    if (response.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No Posts Found for this firstName" });
    }

    res
      .status(200)
      .json({ message: "Avatar URL updated successfully", response });
  } catch (error) {
    console.error("Error updating posts:", error);
    return res.status(500).json({ error: error.message });
  }
}); */

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
app.post("/api/v1/post", upload.single("mediaUrl"), async (req, res) => {
  try {
    // const response = await createPost(req.body, req.file);
    const response = await createPost(
      req.body,
      req.file ? req.file.buffer : null
    );

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
    const updatedPost = await toggleLike(liked, id);

    res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//to edit post by id
app.post("/api/v1/edit/:id", async (req, res) => {
  try {
    const updatePost = req.body;
    const id = req.params.id;
    const updatedPost = await editPost(updatePost, id);

    res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//to edit post by username
app.post("/api/post/edit/:username", async (req, res) => {
  try {
    const updatePost = req.body;
    const username = req.params.username;
    const updatedPost = await editPostAvatar(updatePost, username);

    res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//to delete post
app.delete("/api/user/delete/:id", async (req, res) => {
  try {
    const postToDelete = req.body;
    const id = req.params.id;
    const deletedPost = await deletePost(postToDelete, id);

    res.status(200).json(deletedPost);
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

app.post("/api/v1/unfollow/:userId/:unfollowId", async (req, res) => {
  const { userId, unfollowId } = req.params;

  try {
    const response = await unFollowUser(userId, unfollowId);
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

app.post("/api/v1/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const dataToUpdate = req.body;

  try {
    const response = await updateProfile(userId, dataToUpdate);
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User Profile updated successfully",
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
