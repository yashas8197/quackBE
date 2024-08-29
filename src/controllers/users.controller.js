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

module.exports = { fetchUsers, fetchUserByName };
