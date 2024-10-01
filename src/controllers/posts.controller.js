const { uploadOnCloudinary } = require("../../utils/cloudinary");
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

/* async function updatePostByfirstName(firstName, dataToUpdate) {
  try {
    // Retrieve all posts for the specified firstName
    const posts = await Post.find({ firstName: firstName });
    console.log(posts);

    let modifiedCount = 0; // Counter for modified posts

    // Loop through the retrieved posts and update if username matches
    for (const post of posts) {
      // Update the avatarURL or any other fields you want to update
      post.avatarURL = dataToUpdate.avatarURL; // Update the field
      await post.save(); // Save the updated post
      modifiedCount++; // Increment the modified count
    }

    return { modifiedCount }; // Return the count of modified posts
  } catch (error) {
    console.error("Error updating posts:", error);
    throw error;
  }
} */

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

async function createPost(post, postFile) {
  try {
    let mediaLocalPath;
    if (
      postFile &&
      Array.isArray(postFile?.mediaUrl) &&
      postFile?.mediaUrl.length > 0
    ) {
      mediaLocalPath = postFile?.mediaUrl[0].path;
    }

    const cloudinaryResponse = await uploadOnCloudinary(mediaLocalPath);

    let mediaUrl = cloudinaryResponse?.secure_url;
    const { type, content, username, firstName, lastName, avatarURL } = post;

    const newPost = new Post({
      content,
      mediaUrl: cloudinaryResponse?.secure_url,
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
