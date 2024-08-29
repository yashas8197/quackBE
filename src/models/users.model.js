const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarURL: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  following: [
    {
      firstName: String,
      lastName: String,
      username: String,
      avatarURL: String,
    },
  ],
  followers: [
    {
      firstName: String,
      lastName: String,
      username: String,
      avatarURL: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
