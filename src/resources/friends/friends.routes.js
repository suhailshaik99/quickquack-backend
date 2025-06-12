// Library Imports
import express from "express";

// Local Imports
import FriendsController from "./friends.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.get("/", jwtAuthorizer, FriendsController.getFriends);

router.get(
  "/suggested-friends",
  jwtAuthorizer,
  FriendsController.getSuggestedFriends
);

router.delete(
  "/remove-follower",
  jwtAuthorizer,
  FriendsController.removeFollower
);
router.delete(
  "/remove-following",
  jwtAuthorizer,
  FriendsController.removeFollowing
);

router
  .route("/friend-requests")
  .get(jwtAuthorizer, FriendsController.getFriendRequest)
  .post(jwtAuthorizer, FriendsController.createFriendRequest)
  .put(jwtAuthorizer, FriendsController.confirmFriendRequest)
  .delete(jwtAuthorizer, FriendsController.deleteFriendRequest);

router.delete(
  "/cancel-request",
  jwtAuthorizer,
  FriendsController.cancelFriendRequest
);

export { router };
