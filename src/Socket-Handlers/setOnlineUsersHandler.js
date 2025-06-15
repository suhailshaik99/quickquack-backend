export default function setOnlineUsers(io, socket, onlineUsers) {
  socket.on("add-user", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} added to online users.`);
    }
  });
};

//   export default function setOnlineUsers(io, socket, onlineUsers) {
//   socket.on("add-user", (userId) => {
//     if (!userId) return;

//     const existingSocketId = onlineUsers.get(userId);

//     if (existingSocketId && existingSocketId !== socket.id) {
//       const oldSocket = io.sockets.sockets.get(existingSocketId);
//       if (oldSocket) {
//         oldSocket.disconnect(); // ✅ This is the key line
//         console.log(`🔌 Disconnected old socket (${existingSocketId}) for user ${userId}`);
//       }
//     }

//     onlineUsers.set(userId, socket.id);
//     console.log(`🆕 User ${userId} connected with socket ${socket.id}`);

//     console.log("🔁 Current Online Users Map:");
//     for (const [uid, sid] of onlineUsers.entries()) {
//       console.log(`👤 ${uid} → 🧩 ${sid}`);
//     }
//   });
// };
