import mongoose from "mongoose";
import User from "../users/user.model.js";

export default class SearchRepository {
  static async searchUsers(user, regexArray) {
    const userId = new mongoose.Types.ObjectId(user);

    return await User.aggregate([
      // 1. Filter users matching search terms and exclude the current user
      {
        $match: {
          _id: { $ne: userId },
          $or: regexArray,
        },
      },

      // 2. Lookup: Does the current user follow this matched user?
      {
        $lookup: {
          from: "friends",
          let: { matchedId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$requester", userId] },
                    { $eq: ["$recipient", "$$matchedId"] },
                    { $eq: ["$status", "accepted"] },
                  ],
                },
              },
            },
          ],
          as: "iFollowThisUser",
        },
      },

      // 3. Lookup: Does this matched user follow the current user?
      {
        $lookup: {
          from: "friends",
          let: { matchedId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$requester", "$$matchedId"] },
                    { $eq: ["$recipient", userId] },
                    { $eq: ["$status", "accepted"] },
                  ],
                },
              },
            },
          ],
          as: "userFollowsMe",
        },
      },

      // 4. Lookup: Pending friend requests between current and matched user
      {
        $lookup: {
          from: "friends",
          let: { matchedId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$requester", userId] },
                            { $eq: ["$recipient", "$$matchedId"] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$requester", "$$matchedId"] },
                            { $eq: ["$recipient", userId] },
                          ],
                        },
                      ],
                    },
                    { $eq: ["$status", "pending"] },
                  ],
                },
              },
            },
          ],
          as: "pendingRequests",
        },
      },

      // 5. Compute relationship status fields
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$iFollowThisUser" }, 0] },
          isFollower: { $gt: [{ $size: "$userFollowsMe" }, 0] },
          isFriend: {
            $and: [
              { $gt: [{ $size: "$iFollowThisUser" }, 0] },
              { $gt: [{ $size: "$userFollowsMe" }, 0] },
            ],
          },
          isRequestedByMe: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$pendingRequests",
                    as: "req",
                    cond: { $eq: ["$$req.requester", userId] },
                  },
                },
              },
              0,
            ],
          },
        },
      },

      // 6. Final projection
      {
        $project: {
          username: 1,
          profilePicture: 1,
          isFollowing: 1,
          isFollower: 1,
          isFriend: 1,
          isRequestedByMe: 1,
        },
      },
    ]);
  }

}
