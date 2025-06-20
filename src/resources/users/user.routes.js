//Library Imports
import express from "express";

//Local Imports
import UserController from "./user.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";
import {
  profileUploadToGCS,
  upload,
} from "../../middlewares/multer.js";

const router = express.Router();

router.post("/login", UserController.userLogin);
router.post("/signup", UserController.userSignUp);
router.post("/submit-otp", UserController.submitOTP);
router.post("/request-otp", UserController.requestOTP);
router.get("/authenticate", jwtAuthorizer, UserController.authenticateUser);
router
  .route("/profile-details")
  .get(jwtAuthorizer, UserController.getProfileDetails)
  .put(
    jwtAuthorizer,
    upload.single("profileUpload"),
    profileUploadToGCS,
    UserController.updateProfileDetails
  );
router.get(
  "/profile-details/:username",
  jwtAuthorizer,
  UserController.getUserDetails
);

export { router };
