const Post = require("../models/post.model");

async function fetchPosts() {
  try {
    const posts = await Post.find();

    return { posts };
  } catch (error) {
    throw error;
  }
}

module.exports = { fetchPosts };
