// Local Imports
import setOnlineUsers from "./setOnlineUsersHandler.js";
import receiveMessageHandler from "./Message-Handlers/receiveMessageHandler.js";
import unreadMessagesHandler from "./Message-Handlers/unreadMessagesHandler.js";
import friendRequestHandlers from "./Friends-Handlers/friend-request-handlers.js";

function initSocketServer(io) {

  // JS Map to store the online users.
  const onlineUsers = new Map();

  io.on("connection", (socket) => {

    // Socket connection status messages emit and receive
    socket.emit("back-connection", "socket connected successfully at backend");
    socket.on("front-connection", (msg) => console.log(msg));

    // Event for adding users to online users map
    setOnlineUsers(io, socket, onlineUsers);
    
    // Listening/Emitting to message events
    receiveMessageHandler(io, socket, onlineUsers);

    // Listening to the getUnreadMessages event
    unreadMessagesHandler(io, socket, onlineUsers);

    // Listening for friend request events
    friendRequestHandlers(io, socket, onlineUsers);

    // Socket Disconnection
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`user ${userId} disconnected with socketID: ${socketId}`);
          break;
        }
      }
    });
  });
}

export default initSocketServer;
