// Local Imports
import express from "express";

// Library Imports
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";
import NotificationsController from "../notifications/notification.controller.js";

const router = express.Router();

router.get("/", jwtAuthorizer, NotificationsController.getNotifications);
router.get("/unread-count", jwtAuthorizer, NotificationsController.getUnreadCount);

export { router };