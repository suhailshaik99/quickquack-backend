import catchAsync from "../../utils/CatchAsync.js";
import Notification from "../../resources/notifications/notification.model.js";

export default function likesNotificationsHandlers(io, socket, onlineUsers) {
  socket.on(
    "trigger-like-notification",
    catchAsync(
      async ({
        userId,
        postedBy,
        postId,
        isLikedByUser,
        actionAt,
        fullTime,
      }) => {
        const userSocketId = onlineUsers.get(postedBy.toString());
        if (!isLikedByUser && !(userId === postedBy)) {
          const data = {
            sender: userId,
            receiver: postedBy,
            type: "like",
            post: postId,
            actionAt,
            fullTime,
          };
          await Notification.create(data);
        }
        if (userSocketId) {
          io.to(userSocketId).emit("refresh-notifications");
        }
      }
    )
  );

  socket.on("bulk-mark-read-notifications", async (userId) => {
    try {
      await Notification.updateMany(
        { receiver: userId, isRead: false },
        { $set: { isRead: true } }
      );
      socket.emit("refresh-notifications");
    } catch (error) {
      console.log(error.message);
    }
  });
}
