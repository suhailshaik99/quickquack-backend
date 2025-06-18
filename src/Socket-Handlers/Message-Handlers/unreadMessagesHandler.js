import Message from "../../resources/messages/messages.model.js";
import MessagesRepository from "../../resources/messages/messages.repository.js";

export default function unreadMessagesHandler(io, socket, onlineUsers) {
  socket.on("get-unread-messages", async (userId) => {
    try {
      const userSocketId = onlineUsers.get(userId.toString());
      const unreadMessages = await MessagesRepository.getUnreadMessages(userId);
      if (userSocketId) {
        io.to(userSocketId).emit("unread-messages", unreadMessages);
      }
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on("bulk-mark-read", async ({ userId, receiverId }) => {
    try {
      await Message.updateMany(
        {
          sender: receiverId,
          receiver: userId,
          messageRead: false,
        },
        {
          $set: { messageRead: true },
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  });
}
