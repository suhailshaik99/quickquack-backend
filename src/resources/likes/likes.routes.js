import express from "express";
import LikesController from "./likes.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router
  .route("/:postId")
  .get()
  .post(jwtAuthorizer, LikesController.likePost)
  .delete(jwtAuthorizer, LikesController.unLikePost);

export { router };
