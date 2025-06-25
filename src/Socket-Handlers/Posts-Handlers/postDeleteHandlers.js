import catchAsync from "../../utils/CatchAsync.js";
import Notification from "../../resources/notifications/notification.model.js";

export default function postDeleteHandlers(io, socket, onlineUsers) {
  socket.on(
    "delete-post-notifications",
    catchAsync(async (data) => {
      const { userId, postId } = data;
      const deleteStatus = await Notification.deleteMany({
        sender: userId,
        post: postId,
      });
      socket.emit("refresh-notifications");
    })
  );
}
