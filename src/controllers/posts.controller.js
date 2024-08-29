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

module.exports = { fetchPosts, fetchPostById, updatePost, addCommentToPost };
