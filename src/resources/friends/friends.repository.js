import mongoose from "mongoose";
import User from "../users/user.model.js";
import Friends from "./friends.model.js";

export default class FriendsRepository {
  // Version 1
  //   static async getSuggestedFriends(userId) {
  //   const user = new mongoose.Types.ObjectId(userId);
  //   const suggestedFriends = await User.aggregate([
  //     { $match: { _id: { $ne: user } } },

  //     // Who received a request from CURRENT user
  //     {
  //       $lookup: {
  //         from: "friends",
  //         let: { suggestedId: "$_id" },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$recipient", "$$suggestedId"] },
  //                   { $eq: ["$requester", user] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //         as: "sentRequests",
  //       },
  //     },

  //     // Who are already accepted friends (either requester or recipient)
  //     {
  //       $lookup: {
  //         from: "friends",
  //         let: { suggestedId: "$_id" },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$status", "accepted"] },
  //                   {
  //                     $or: [
  //                       {
  //                         $and: [
  //                           { $eq: ["$requester", "$$suggestedId"] },
  //                           { $eq: ["$recipient", user] },
  //                         ],
  //                       },
  //                       {
  //                         $and: [
  //                           { $eq: ["$recipient", "$$suggestedId"] },
  //                           { $eq: ["$requester", user] },
  //                         ],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //         as: "alreadyFriends",
  //       },
  //     },

  //     // Add boolean fields
  //     {
  //       $addFields: {
  //         isRequested: { $gt: [{ $size: "$sentRequests" }, 0] },
  //         isFriend: { $gt: [{ $size: "$alreadyFriends" }, 0] },
  //       },
  //     },

  //     // Filter out already friends
  //     {
  //       $match: {
  //         isFriend: false,
  //       },
  //     },

  //     {
  //       $project: {
  //         name: 1,
  //         username: 1,
  //         profilePicture: 1,
  //         isRequested: 1,
  //       },
  //     },
  //   ]);

  //   return suggestedFriends;
  // }

  // Version 2
  static async getSuggestedFriends(userId) {
    const user = new mongoose.Types.ObjectId(userId);

    const suggestedFriends = await User.aggregate([
      // 1. Exclude the current user
      { $match: { _id: { $ne: user } } },

      // 2. Lookup where this user is the recipient and current user is the requester
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "recipient",
          as: "requestsReceived",
        },
      },

      // 3. Lookup where this user is the requester and current user is the recipient
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "requester",
          as: "requestsSent",
        },
      },

      // 4. Add isRequested (if any request has user as recipient and current user as sender)
      {
        $addFields: {
          isRequested: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$requestsReceived",
                    as: "req",
                    cond: {
                      $eq: ["$$req.requester", user],
                    },
                  },
                },
              },
              0,
            ],
          },
          isFriend: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$requestsReceived",
                    as: "r",
                    cond: {
                      $and: [
                        { $eq: ["$$r.requester", user] },
                        { $eq: ["$$r.status", "accepted"] },
                      ],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },

      // 5. Filter: only show users who are not friends
      {
        $match: {
          isFriend: false,
        },
      },

      // 6. Optional: limit or shape response
      {
        $project: {
          username: 1,
          name: 1,
          profilePicture: 1,
          isRequested: 1,
        },
      },
    ]);

    return suggestedFriends;
  }

  static async createFriendRequest(data) {
    return await Friends.create(data);
  }

  static async cancelFriendRequest(data) {
    return await Friends.deleteOne(data);
  }

  static async getFriendRequest(recipient) {
    return await Friends.find({ recipient, status: "pending" }).populate(
      "requester"
    );
  }

  static async confirmFriendRequest(docId, data) {
    return await Friends.findByIdAndUpdate(docId, data);
  }

  static async deleteFriendRequest(data) {
    return await Friends.deleteOne(data);
  }
}
