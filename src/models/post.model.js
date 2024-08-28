const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  avatarURL: String,
});

const VoteSchema = new Schema({
  upvotedBy: [UserSchema],
  downvotedBy: [UserSchema],
});

const CommentSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  avatarURL: String,
  text: String,
  votes: VoteSchema,
  createdAt: { type: Date, default: Date.now },
});

const LikeSchema = new Schema({
  likeCount: { type: Number, default: 0 },
  likedBy: [UserSchema],
  dislikedBy: [UserSchema],
});

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    likes: LikeSchema,
    comments: [CommentSchema],
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatarURL: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
