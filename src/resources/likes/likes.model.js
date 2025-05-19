import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  likedAt: {
    type: Date,
    default: Date.now(),
  },
});

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Likes = new mongoose.model("Likes", likeSchema);
export default Likes;
