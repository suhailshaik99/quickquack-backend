//Library Imports
import express from "express";

//Local Imports
import UserController from "./user.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.post("/login", UserController.userLogin);
router.post("/signup", UserController.userSignUp);
router.post("/submit-otp", UserController.submitOTP);
router.post("/request-otp", UserController.requestOTP);
router.get("/authenticate", jwtAuthorizer, UserController.authenticateUser);

export { router };