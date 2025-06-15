// Library Imports
import crypto from "crypto";

// Local Imports
import signJWT from "../../utils/signJWT.js";
import AppError from "../../utils/AppError.js";
import UserRepository from "./user.repository.js";
import catchAsync from "../../utils/CatchAsync.js";

class UserController {
  static userSignUp = catchAsync(async (req, res, next) => {
    const userDetails = await UserRepository.signUpUser(req.body);
    return res.status(200).json({
      success: true,
      status: "User Created Successfully",
    });
  });

  static userLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const userDetails = await UserRepository.loginUser(email, password);
    if (!userDetails)
      return next(new AppError("Email or Password is Invalid", 401));

    let payload = {
      id: userDetails._id,
      email: userDetails.email,
    };

    const token = signJWT(payload, process.env.JWT_SECRET, "2h");
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 120 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      status: "User Authenticated!!",
      userDetails,
    });
  });

  static requestOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const token = await UserRepository.requestOTP(email);
    if (!token) {
      return next(new AppError("Account doesn't exist with this email.", 404));
    }
    res.status(200).json({
      success: true,
      status: "OTP sent successfully to your email..!",
    });
  });

  static submitOTP = catchAsync(async (req, res, next) => {
    const { otp, password, confirmPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(otp).digest("hex");
    const result = await UserRepository.submitOTP(
      hashedToken,
      password,
      confirmPassword
    );
    if (!result) return next(new AppError("Invalid OTP..!", 404));
    res.status(200).json({
      success: true,
      status: "Password Changed Successfully..!",
    });
  });

  static authenticateUser = catchAsync(async (req, res, next) => {
    const user = await UserRepository.getUserDetails(req.id);
    if (!user) return next(new AppError("Invalid User", 404));
    res.status(200).json({
      success: true,
      status: "User Authenticated Succesfully!.",
      user,
    });
  });

  static getProfileDetails = catchAsync(async (req, res, next) => {
    const profileDetails = await UserRepository.getProfileDetails(req.id);
    if (!profileDetails) return next(new AppError("User not found", 404));
    res.status(200).json({
      success: true,
      status: "Profile Details fetched successfully..!",
      profileDetails,
    });
  });

  static getUserDetails = catchAsync(async (req, res, next) => {
    const { username } = req.params;
    const userDetails = await UserRepository.getUserProfileDetails(username);
    res.status(200).json({
      success: true,
      status: "fetched user details successfully!",
      userDetails,
    });
  });
}

export default UserController;
