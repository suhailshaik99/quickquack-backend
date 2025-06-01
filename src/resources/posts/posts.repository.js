import mongoose from "mongoose";
import Posts from "./posts.model.js";

class PostsRepository {
  static async getPostsByUserId(userId) {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    return await Posts.aggregate([
      { $match: { postedBy: objectUserId } },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $addFields: { commentsCount: { $size: "$comments" } } },
      {
        $addFields: {
          isLikedByUser: {
            $in: [new mongoose.Types.ObjectId(userId), "$likes.userId"],
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  }

  static async createPost(data) {
    return await Posts.create(data);
  }
}

export default PostsRepository;
