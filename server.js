// Library Imports
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Local Imports
import ConnectDB from "./src/database/db.config.js";
import GlobalErrHandler from "./src/utils/GlobalErrHandler.js";
import { router as userRouter } from "./src/resources/users/user.routes.js";
import { router as likesRouter } from "./src/resources/likes/likes.routes.js";
import { router as postsRouter } from "./src/resources/posts/posts.routes.js";
import { router as friendsRouter } from "./src/resources/friends/friends.routes.js";
import { router as commentsRouter } from "./src/resources/comments/comments.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/config.env` });

// Creating express server
const app = express();

// Route Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Application Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/comments", commentsRouter);

// Unhandled Routes
app.all("*", (req, res) => {
  res.status(404).json({
    ok: false,
    message: "This route doesn't exist",
  });
});

// Global Error Handler
app.use(GlobalErrHandler);

// Express Server listening to the HTTP requests.
app.listen(process.env.PORT, () => {
  ConnectDB();
  console.log(`Application is listening on port ${process.env.PORT}`);
});
