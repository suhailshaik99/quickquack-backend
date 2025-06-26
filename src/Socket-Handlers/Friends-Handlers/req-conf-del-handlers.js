export default function reqConfDelHandlers(io, socket, onlineUsers) {
    socket.on("req-confirmation-notifications", userId => {
        const userSocketId = onlineUsers.get(userId.toString());
        if(userSocketId) {
            io.to(userSocketId).emit("refresh-suggestions-box");
        }
    })
}