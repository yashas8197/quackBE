const User = require("../models/users.model");

async function fetchUsers() {
  try {
    const users = await User.find();

    return { users };
  } catch (error) {
    throw error;
  }
}

async function fetchUserByName(username) {
  try {
    const user = await User.findOne({ username: username });
    return { user };
  } catch (error) {
    throw error;
  }
}
async function updateUserFollowing(id, newFollowRequest) {
  try {
    const user = await User.findById(id);
    user.following.push(newFollowRequest);

    const updatedUser = await user.save();

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function updateUserFollowers(id, newFollowRequest) {
  try {
    const user = await User.findById(id);
    user.followers.push(newFollowRequest);

    const updatedUser = await user.save();

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchUsers,
  fetchUserByName,
  updateUserFollowing,
  updateUserFollowers,
};
