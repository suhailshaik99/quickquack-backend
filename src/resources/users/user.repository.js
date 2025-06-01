import mongoose from "mongoose";

import User from "./user.model.js";
import AppError from "../../utils/AppError.js";
import sendEmail from "../../utils/NodeMailer.js";

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

  static async getUserProfileDetails(username) {
    const user = await User.findOne(
      { username },
      {
        _id: 1,
      }
    );
    const userProfileDetails = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postedBy",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "requester",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "recepient",
          as: "followers",
        },
      },
      {
        $addFields: {
          postsCount: { $size: "$posts" },
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
        },
      },
      {
        $project: {
          __v: 0,
          email: 0,
          active: 0,
          mobile: 0,
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          dateOfBirth: 0,
          confirmPassword: 0,
          passwordChangedAt: 0,
          passwordResetToken: 0,
          passwordResetExpires: 0,
        },
      },
    ]);
    return userProfileDetails[0];
  }

  static async getProfileDetails(id) {
    const userId = new mongoose.Types.ObjectId(id);
    const profileDetails = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postedBy",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "requester",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "recepient",
          as: "followers",
        },
      },
      {
        $addFields: {
          postsCount: { $size: "$posts" },
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
        },
      },
      {
        $project: {
          posts: 1,
          postsCount: 1,
          followers: 1,
          following: 1,
          followersCount: 1,
          followingCount: 1,
        },
      },
    ]);
    if (profileDetails) {
      return profileDetails[0];
    } else {
      return false;
    }
  }
}

export default UserRepository;
