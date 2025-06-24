// Library Imports
import express from "express";

// Local Imports
import LogoutController from "./logout.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.get("/", jwtAuthorizer, LogoutController.userLogout);

export { router };
