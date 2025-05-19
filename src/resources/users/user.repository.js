import User from "./user.model.js";
import sendEmail from "../../utils/NodeMailer.js";
import AppError from "../../utils/AppError.js";

class UserRepository {
  static async signUpUser(userData) {
    return await User.create(userData);
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return false;
    const success = await user.comparePassword(password, user.password);
    return success ? user : false;
  }

  static async requestOTP(email) {
    const user = await User.findOne({ email });
    if (!user) return false;
    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 mins)",
        token,
      });
      return token;
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError("Failed to send otp to your email", 500);
    }
  }

  static async submitOTP(otp, password, confirmPassword) {
    const user = await User.findOne({
      passwordResetToken: otp,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return false;
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    const updatedUser = await user.save();
    return updatedUser ? true : false;
  }

  static async getUserDetails(id) {
    const user = await User.findById(
      { _id: id },
      {
        __v: 0,
        confirmPassword: 0,
        createdAt: 0,
        updatedAt: 0,
        passwordResetExpires: 0,
        passwordResetToken: 0,
        passwordChangedAt: 0,
      }
    );
    if (!user) return false;
    return user;
  }
}

export default UserRepository;
