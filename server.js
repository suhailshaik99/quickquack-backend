import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import ConnectDB from "./src/database/db.config.js";
import GlobalErrHandler from "./src/utils/GlobalErrHandler.js";
import { router as userRouter } from "./src/resources/users/user.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    ok: false,
    message: "This route doesn't exist",
  });
});

app.use(GlobalErrHandler);

app.listen(process.env.PORT, () => {
  ConnectDB();
  console.log(`Application is listening on port ${process.env.PORT}`);
});
