// Library Imports
import express from "express";

// Local Imports
import FriendsController from "./friends.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.get(
  "/suggested-friends",
  jwtAuthorizer,
  FriendsController.getSuggestedFriends
);

export { router };
