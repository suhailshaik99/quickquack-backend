import catchAsync from "../../utils/CatchAsync.js";
import FriendsRepository from "../../resources/friends/friends.repository.js";
import Notification from "../../resources/notifications/notification.model.js";

export default function postsNotificationsHandlers(io, socket, onlineUsers) {
  socket.on(
    "trigger-postCreation-notifications",
    catchAsync(async (data) => {
      const { userId, newPostId, actionAt, fullTime } = data;
      const { followers = [] } = await FriendsRepository.getFriends(userId);
      if (!followers.length) return;

      const notificationsToInsert = followers.map((follower) => ({
        sender: userId,
        receiver: follower._id,
        type: "new-post",
        post: newPostId,
        actionAt,
        fullTime,
        isRead: false,
      }));
      await Notification.insertMany(notificationsToInsert);

      for (let i of followers) {
        if (onlineUsers.get(i._id.toString())) {
          io.to(onlineUsers.get(i._id.toString())).emit(
            "refresh-notifications"
          );
        }
      }
    })
  );
}
