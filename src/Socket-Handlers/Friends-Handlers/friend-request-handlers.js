export default function friendRequestHandlers(io, socket, onlineUsers) {
    socket.on("send-friend-request", userId => {
        const userSocketId = onlineUsers.get(userId.toString());
        if (userSocketId) {
            io.to(userSocketId).emit("new-friend-request");
        };
    })
}