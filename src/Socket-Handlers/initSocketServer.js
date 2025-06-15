// Local Imports
import getOnlineUsers from "./getOnlineUsersHandler.js";
import setOnlineUsers from "./setOnlineUsersHandler.js";
import receiveMessageHandler from "./Message-Handlers/receiveMessageHandler.js";

function initSocketServer(io) {

  // JS Map to store the online users.
  const onlineUsers = new Map();

  io.on("connection", (socket) => {

    // Socket connection status messages emit and receive
    socket.emit("back-connection", "socket connected successfully at backend");
    socket.on("front-connection", (msg) => console.log(msg));

    // Event for adding users to online users map
    setOnlineUsers(io, socket, onlineUsers);
    // Getting the online users among the friends of user
    // getOnlineUsers(io, socket, onlineUsers);
    // Listening/Emitting to message events
    receiveMessageHandler(io, socket, onlineUsers);

    // Socket Disconnection
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      socket.emit("online-users-response", onlineUsers);
    });
  });
}

export default initSocketServer;
