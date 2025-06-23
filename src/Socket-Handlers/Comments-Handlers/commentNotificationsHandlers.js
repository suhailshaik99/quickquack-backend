import catchAsync from "../../utils/CatchAsync.js";
import Notification from "../../resources/notifications/notification.model.js";

export default function commentNotificationsHandlers(io, socket, onlineUsers) {
  socket.on(
    "trigger-comment-notifications",
    catchAsync(async (data) => {
      const {
        userId: sender,
        postedBy: receiver,
        postId,
        actionAt,
        fullTime,
      } = data || {};
      const userSocketId = onlineUsers.get(receiver.toString());
      const docData = {
        sender,
        receiver,
        type: "comment",
        post: postId,
        actionAt,
        fullTime,
      };
      if (!(sender === receiver)) {
        await Notification.create(docData);
      }
      if (userSocketId) {
        io.to(userSocketId).emit("refresh-notifications");
      }
    })
  );
}
