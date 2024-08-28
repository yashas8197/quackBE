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

module.exports = { fetchPosts, fetchPostById };
