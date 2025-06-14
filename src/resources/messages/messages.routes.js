import express from "express";
import MessagesController from "./messages.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router
  .route("/")
  .get(jwtAuthorizer, MessagesController.getMessages)
  .post(jwtAuthorizer, MessagesController.createMessage)
  .put(jwtAuthorizer, MessagesController.editMessage)
  .delete(jwtAuthorizer, MessagesController.deleteMessage);

export { router };
