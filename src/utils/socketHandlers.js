function initSocketServer(io) {
  io.on("connection", (socket) => {
    socket.emit("connection", "socket connected successfully at backend");
    console.log("Socket connected with frontend successfully", socket.id);
  });
}

export default initSocketServer;
