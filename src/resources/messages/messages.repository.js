import mongoose from "mongoose";
import Message from "./messages.model.js";

export default class MessagesRepository {
  static async getMessages(user) {
    const userId = new mongoose.Types.ObjectId(user);
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $addFields: {
          createdAtDate: { $toDate: "$createdAt" },
        },
      },
      {
        $addFields: {
          threadId: {
            $cond: {
              if: { $gt: ["$sender", "$receiver"] },
              then: {
                $concat: [
                  { $toString: "$receiver" },
                  "_",
                  { $toString: "$sender" },
                ],
              },
              else: {
                $concat: [
                  { $toString: "$sender" },
                  "_",
                  { $toString: "$receiver" },
                ],
              },
            },
          },
        },
      },
      // Sort by the reliable createdAtDate to ensure we get the truly last message
      { $sort: { createdAtDate: -1 } },
      {
        $group: {
          _id: "$threadId",
          message: { $first: "$message" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
          originalMessageSentAt: { $first: "$messageSentAt" },
          latestCreatedAt: { $first: "$createdAtDate" },
        },
      },
      {
        $addFields: {
          otherUserId: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "otherUser",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $project: {
          _id: 0,
          lastMessage: "$message",
          messageSentAt: "$originalMessageSentAt",
          otherUserId: 1,
          username: "$otherUser.username",
          profilePicture: "$otherUser.profilePicture",
          latestCreatedAt: 1,
        },
      },
      // Final sort based on the reliable latestCreatedAt timestamp for conversations order
      { $sort: { latestCreatedAt: -1 } },
    ]);
    return messages;
  }

  static async getUnreadMessages(user) {
    const userId = new mongoose.Types.ObjectId(user);

    return await Message.aggregate([
      {
        $match: {
          receiver: userId,
          messageRead: false,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          sender: 1,
          receiver: 1,
          message: 1,
          messageRead: 1,
          messageSentAt: 1,
          fullTime: 1,
        },
      },
    ]);
  }

  static async getUserMessages(senderId, receiverId) {
    const sender = new mongoose.Types.ObjectId(senderId);
    const receiver = new mongoose.Types.ObjectId(receiverId);
    return await Message.aggregate([
      {
        $match: {
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          message: 1,
          fullTime: 1,
          messageSentAt: 1,
          createdAt: 1,
          user: {
            $eq: ["$sender", sender],
          },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);
  }
}
