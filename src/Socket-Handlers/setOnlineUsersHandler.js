export default function setOnlineUsers(io, socket, onlineUsers) {
  socket.on("add-user", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} added to online users.`);
    }
  });
};