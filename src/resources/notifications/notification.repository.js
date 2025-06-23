import mongoose from "mongoose";
import Notification from "./notification.model.js";

export default class NotificationsRepository {
  static async getNotifications(userId) {
    const receiver = new mongoose.Types.ObjectId(userId);
    return await Notification.find(
      { receiver },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    )
      .sort({
        createdAt: -1,
      })
      .populate("sender", "username profilePicture")
      .populate("post", "postUrl");
  }

  static async getUnreadCount(userId) {
    return await Notification.find({receiver: userId, isRead: false});
  }

}
