import crypto from "crypto";

import signJWT from "../../utils/signJWT.js";
import AppError from "../../utils/AppError.js";
import UserRepository from "./user.repository.js";
import catchAsync from "../../utils/catchAsync.js";

class UserController {
  static userSignUp = catchAsync(async (req, res, next) => {
    const userDetails = await UserRepository.signUpUser(req.body);
    let payload = {
      id: userDetails._id,
      email: userDetails.email,
    };
    const token = signJWT(payload, process.env.JWT_SECRET, "5m");
    res.cookie("jwt-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 5 * 60 * 1000,
    });
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

    const token = signJWT(payload, process.env.JWT_SECRET, "5m");
    res.cookie("jwt-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 5 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      status: "User Authenticated!!",
      userDetails,
      token,
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
      token,
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
}

export default UserController;
