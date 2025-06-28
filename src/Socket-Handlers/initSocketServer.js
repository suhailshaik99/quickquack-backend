// Local Imports
import setOnlineUsers from "./setOnlineUsersHandler.js";
import postDeleteHandlers from "./Posts-Handlers/postDeleteHandlers.js";
import reqConfDelHandlers from "./Friends-Handlers/req-conf-del-handlers.js";
import receiveMessageHandler from "./Message-Handlers/receiveMessageHandler.js";
import unreadMessagesHandler from "./Message-Handlers/unreadMessagesHandler.js";
import friendRequestHandlers from "./Friends-Handlers/friend-request-handlers.js";
import likesNotificationsHandlers from "./Likes-Handlers/likesNotificationsHandlers.js";
import postsNotificationsHandlers from "./Posts-Handlers/postsNotificationsHandlers.js";
import commentNotificationsHandlers from "./Comments-Handlers/commentNotificationsHandlers.js";

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
    // Listening for req conf/del notifications
    reqConfDelHandlers(io, socket, onlineUsers);
    // Listening for triggering posts notifications
    postsNotificationsHandlers(io, socket, onlineUsers);
    // Listening for triggering posts delete notifications
    postDeleteHandlers(io, socket, onlineUsers);
    // Listening for triggering likes notifications
    likesNotificationsHandlers(io, socket, onlineUsers);
    // Listening for triggering comments notifications
    commentNotificationsHandlers(io, socket, onlineUsers);

    // Socket Disconnection
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
}

export default initSocketServer;
