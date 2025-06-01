// Library Imports
import express from "express";

// Local Imports
import CommentsController from "./comments.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router
  .route("/:postId")
  .get(jwtAuthorizer, CommentsController.getComments)
  .post(jwtAuthorizer, CommentsController.createComment)
  .put()
  .delete(CommentsController.deleteComment);

export { router };
