import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You must be a valid user to create post.."],
    },
    postUrl: String,
    description: String,
    location: String,
  },
  {
    timestamps: true,
  }
);

postSchema.index({ postedBy: 1 });

const Posts = new mongoose.model("Posts", postSchema);
export default Posts;
