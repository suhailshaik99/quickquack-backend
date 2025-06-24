import mongoose from "mongoose";

import Posts from "./posts.model.js";
import Friends from "../friends/friends.model.js";
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
      {
        $project: {
          likes: 0,
          comments: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  }

  static async getFeedPosts(userId) {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const followingUsers = await Friends.aggregate([
    {
      $match: {
        requester: objectUserId,
        status: "accepted",
      },
    },
    {
      $project: {
        _id: 0,
        followingUserId: "$recipient",
      },
    },
  ]);

  const followingIds = followingUsers.map((f) => f.followingUserId);
  const usersToInclude = [objectUserId, ...followingIds];

  return await Posts.aggregate([
    {
      $match: {
        postedBy: { $in: usersToInclude },
      },
    },
    // Lookup likes count
    {
      $lookup: {
        from: "likes",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$postId", "$$postId"] },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              likedByUser: {
                $addToSet: {
                  $cond: [
                    { $eq: ["$userId", objectUserId] },
                    true,
                    "$$REMOVE"
                  ]
                }
              }
            }
          }
        ],
        as: "likeData",
      },
    },
    {
      $addFields: {
        likesCount: {
          $ifNull: [{ $arrayElemAt: ["$likeData.count", 0] }, 0],
        },
        isLikedByUser: {
          $gt: [{ $size: { $ifNull: [{ $arrayElemAt: ["$likeData.likedByUser", 0] }, []] } }, 0],
        },
      },
    },
    // Lookup comments count
    {
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$postId", "$$postId"] },
            },
          },
          { $count: "count" },
        ],
        as: "commentData",
      },
    },
    {
      $addFields: {
        commentsCount: {
          $ifNull: [{ $arrayElemAt: ["$commentData.count", 0] }, 0],
        },
      },
    },
    // Populate postedBy with username and profilePicture
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
      },
    },
    {
      $unwind: "$postedBy",
    },
    {
      $project: {
        _id: 1,
        caption: 1,
        postUrl: 1,
        description: 1,
        postedAt: 1,
        postedOn: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
        isLikedByUser: 1,
        "postedBy._id": 1,
        "postedBy.username": 1,
        "postedBy.profilePicture": 1,
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
      _id: postId,
    });
    if (!existingPost) {
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
