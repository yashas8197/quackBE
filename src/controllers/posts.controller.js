const Post = require("../models/post.model");

async function fetchPosts() {
  try {
    const posts = await Post.find();
    return { posts };
  } catch (error) {
    throw error;
  }
}

async function fetchPostById(id) {
  try {
    const post = await Post.findById(id);
    return { post };
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, dataToUpdate) {
  try {
    const post = await Post.findByIdAndUpdate(id, dataToUpdate, { new: true });
    return { post };
  } catch (error) {
    throw error;
  }
}

async function addCommentToPost(id, comment) {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    post.comments.push(comment);

    const updatedPost = await post.save();
    return updatedPost;
  } catch (error) {
    throw error;
  }
}

async function createPost(post) {
  try {
    const {
      type,
      content,
      mediaUrl,
      username,
      firstName,
      lastName,
      avatarURL,
    } = post;

    const newPost = new Post({
      content,
      mediaUrl,
      username,
      firstName,
      lastName,
      avatarURL,
      type,
      likes: {
        likeCount: 0,
        likedBy: [],
        dislikedBy: [],
      },
      comments: [],
      isMarked: false,
    });
    const savedPost = await newPost.save();

    return savedPost;
  } catch (error) {
    throw error;
  }
}

async function toggleLike(liked, postId) {
  try {
    const post = await Post.findById(postId); // find the post by ID

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the user already liked the post
    const userIndex = post.likes.likedBy.findIndex(
      (user) => user.username === liked.username
    );

    if (userIndex !== -1) {
      // User already liked the post, so unlike it
      post.likes.likeCount -= 1;
      post.likes.likedBy.splice(userIndex, 1); // remove user from likedBy array
    } else {
      // User hasn't liked the post, so like it
      post.likes.likeCount += 1;
      post.likes.likedBy.push(liked); // add user to likedBy array
    }

    // Save the updated post and return it
    const updatedPost = await post.save();
    return updatedPost;
  } catch (error) {
    throw new Error("Error toggling like: " + error.message);
  }
}

async function editPost(updatePost, id) {
  try {
    const post = await Post.findByIdAndUpdate(id, updatePost, { new: true });
    return { post };
  } catch (error) {
    throw error;
  }
}

async function editPostAvatar(updatePost, username) {
  try {
    const post = await Post.findOneAndUpdate(
      { username: username },
      updatePost,
      {
        new: true,
      }
    );
    return { post };
  } catch (error) {
    throw error;
  }
}

async function deletePost(postToDelete, id) {
  try {
    const post = await Post.findByIdAndDelete(id, postToDelete, { new: true });
    return { post };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchPosts,
  fetchPostById,
  updatePost,
  addCommentToPost,
  toggleLike,
  createPost,
  editPost,
  deletePost,
  editPostAvatar,
};
