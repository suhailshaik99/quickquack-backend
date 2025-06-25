// Local Imports
import catchAsync from "../../utils/CatchAsync.js";
import NotificationsRepository from "./notification.repository.js";

export default class NotificationsController {
  static getNotifications = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const notifications = await NotificationsRepository.getNotifications(
      userId
    );
    if (notifications.length == 0) {
      return res.status(200).json({
        success: true,
        status: "No notifications yet!",
        notifications
      });
    }
    return res.status(200).json({
      success: true,
      status: "Notifications fetched successfully!",
      notifications,
    });
  });

  static getUnreadCount = catchAsync(async(req, res, next) => {
    const userId = req.id;
    const unreadCount = await NotificationsRepository.getUnreadCount(userId);
    return res.status(200).json({
      success: true,
      status: "Unread count fetched successfully",
      unreadCount: unreadCount.length
    })
  })

}
