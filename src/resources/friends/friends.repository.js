import mongoose from "mongoose";
import Friends from "./friends.model.js";
import User from "../users/user.model.js";

export default class FriendsRepository {

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

  static async getFriends(id) {
    const userId = new mongoose.Types.ObjectId(id);
    const friends = await User.aggregate([
      { $match: { _id: userId } },
      // Followers: people who sent me a request (I am the recipient)
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "recipient",
          as: "followers",
        },
      },

      // Following: people I sent a request to (I am the requester)
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "requester",
          as: "following",
        },
      },

      // Populate followers with requester details
      {
        $lookup: {
          from: "users",
          localField: "followers.requester",
          foreignField: "_id",
          as: "followerUsers",
        },
      },

      // Populate following with recipient details
      {
        $lookup: {
          from: "users",
          localField: "following.recipient",
          foreignField: "_id",
          as: "followingUsers",
        },
      },

      {
        $project: {
          _id: 1,
          followers: {
            $map: {
              input: "$followerUsers",
              as: "f",
              in: {
                _id: "$$f._id",
                username: "$$f.username",
                profilePicture: "$$f.profilePicture",
              },
            },
          },
          following: {
            $map: {
              input: "$followingUsers",
              as: "f",
              in: {
                _id: "$$f._id",
                username: "$$f.username",
                profilePicture: "$$f.profilePicture",
              },
            },
          },
        },
      },
    ]);

    return friends[0];
  }

  static async removeFollower(userId, friendId) {
    return await Friends.findOneAndDelete({
      recipient: userId,
      requester: friendId,
    });
  }

  static async removeFollowing(userId, friendId) {
    return await Friends.findOneAndDelete({
      recipient: friendId,
      requester: userId,
    });
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
