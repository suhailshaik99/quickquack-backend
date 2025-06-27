// Library Imports
import http from "http";
import { Server } from "socket.io";

// Local Imports
import app from "./App.js";
import ConnectDB from "./src/database/db.config.js";
import initSocketServer from "./src/Socket-Handlers/initSocketServer.js";

const allowedOrigins = [
  "http://localhost",
  "http://localhost:5173",
  "https://quickquack.in",
];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

initSocketServer(io);

server.listen(process.env.PORT, () => {
  ConnectDB();
  console.log("Socket Server is up and running...");
  console.log(`Application is listening on port ${process.env.PORT}`);
});
