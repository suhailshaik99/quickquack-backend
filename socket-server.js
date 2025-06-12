// Library Imports
import http from "http";
import { Server } from "socket.io";

// Local Imports
import app from "./server.js";
import ConnectDB from "./src/database/db.config.js";
import initSocketServer from "./src/utils/socketHandlers.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
});

initSocketServer(io);

server.listen(process.env.PORT, () => {
  ConnectDB();
  console.log("Socket Server is up and running...");
  console.log(`Application is listening on port ${process.env.PORT}`);
});
