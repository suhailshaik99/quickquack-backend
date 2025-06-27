// Library Imports
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import express from "express";
import xssClean from "xss-clean";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Local Imports
import GlobalErrHandler from "./src/utils/GlobalErrHandler.js";
import { router as userRouter } from "./src/resources/users/user.routes.js";
import { router as likesRouter } from "./src/resources/likes/likes.routes.js";
import { router as postsRouter } from "./src/resources/posts/posts.routes.js";
import { router as searchRouter } from "./src/resources/Search/search.routes.js";
import { router as logoutRouter } from "./src/resources/logout/logout.routes.js";
import { router as friendsRouter } from "./src/resources/friends/friends.routes.js";
import { router as messagesRouter } from "./src/resources/messages/messages.routes.js";
import { router as commentsRouter } from "./src/resources/comments/comments.routes.js";
import { router as NotificationsRouter } from "./src/resources/notifications/notification.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: `${__dirname}/config.env` });

// Creating express server
const app = express();

const allowedOrigins = [
  "http://localhost",
  "http://localhost:5173",
  "https://quickquack.in",
  "http://192.168.233.138",
];

// Route Middlewares
app.use(helmet());
app.use(xssClean());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Application Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/notifications", NotificationsRouter);

// Unhandled Routes
app.all("*", (req, res) => {
  res.status(404).json({
    ok: false,
    message: "This route doesn't exist",
  });
});

// Global Error Handler
app.use(GlobalErrHandler);

export default app;
