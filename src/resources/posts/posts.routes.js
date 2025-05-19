import express from "express";

import PostsController from "./posts.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";
import { upload, uploadToGCS } from "../../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .get(jwtAuthorizer, PostsController.getPostsByUserId)
  .post(
    jwtAuthorizer,
    upload.single("postUpload"),
    uploadToGCS,
    PostsController.createPost
  );

export { router };
