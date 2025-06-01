import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Comment cannot be empty"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1, postId: 1 });
commentSchema.index({ postId: 1, commentedAt: -1 });

const Comments = mongoose.model("Comments", commentSchema);
export default Comments;
