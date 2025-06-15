import catchAsync from "../../utils/CatchAsync.js";
import Message from "../../resources/messages/messages.model.js";

export default function receiveMessageHandler(io, socket, onlineUsers) {
  socket.on(
    "private-message",
    catchAsync(async (msg) => {
      const { sender, receiver, message, messageSentAt, fullTime } = msg;

      await Message.create({
        sender,
        receiver,
        message,
        messageSentAt,
        fullTime,
      });

      const receiverSocketId = onlineUsers.get(receiver.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private-message", msg);
      }
    })
  );

  socket.on("typing", ({ userId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing");
    }
  });
}
