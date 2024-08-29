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
    const { type, content, mediaUrl, username, firstName, lastName, avatarURL } =
      post;

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

async function likePost(liked, id) {
  try {
    const post = await Post.findById(id);

    if (!post) {
      throw new Error("Post not found");
    }

    const userIndex = post.likes.likedBy.findIndex(
      (user) => user.username === liked.username
    );

    if (userIndex !== -1) {
      post.likes.likeCount -= 1;
      post.likes.likedBy.splice(userIndex, 1);
    } else {
      post.likes.likeCount += 1;
      post.likes.likedBy.push(liked);
    }

    const updatedPost = await post.save();

    return updatedPost;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchPosts,
  fetchPostById,
  updatePost,
  addCommentToPost,
  likePost,
  createPost,
};
