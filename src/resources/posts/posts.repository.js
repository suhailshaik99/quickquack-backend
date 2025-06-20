import mongoose from "mongoose";
import Posts from "./posts.model.js";
import { deletePostFromGCS } from "../../middlewares/multer.js";

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

  static async deletePost(user, post) {
    const userId = new mongoose.Types.ObjectId(user);
    const postId = new mongoose.Types.ObjectId(post);
    const existingPost = await Posts.findOne({
      _id: postId
    })
    if(!existingPost) {
      return false;
    }
    await deletePostFromGCS(existingPost.postUrl);
    return await Posts.findOneAndDelete({
      _id: postId,
      postedBy: userId,
    });
  }
}

export default PostsRepository;
