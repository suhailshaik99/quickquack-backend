// Library Imports
import mongoose from "mongoose";

// Local Imports
import User from "./user.model.js";
import AppError from "../../utils/AppError.js";
import sendEmail from "../../utils/sendEmail.js";
import { deletePostFromGCS } from "../../middlewares/multer.js";

class UserRepository {
  // Signing Up the user
  static async signUpUser(userData) {
    return await User.create(userData);
  }

  // Logging In the user
  static async loginUser(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return false;
    const success = await user.comparePassword(password, user.password);
    return success ? user : false;
  }

  // Requesting OTP
  static async requestOTP(email) {
    const user = await User.findOne({ email });
    if (!user) return false;
    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    try {
      await sendEmail({
        email: user.email,
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

  // Submitting OTP
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

  // Getting LoggedIn user details
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

  // Getting friends profile details (not logged in user)
  static async getUserProfileDetails(username) {
    const user = await User.findOne(
      { username },
      {
        _id: 1,
      }
    );
    if (!user) return false;
    const userProfileDetails = await User.aggregate([
      { $match: { _id: user._id } },

      // Get all posts by the user
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postedBy",
          as: "posts",
        },
      },

      // Get all following (user sent requests)
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "requester",
          as: "following",
        },
      },

      // Get all followers (user received requests)
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "recipient",
          as: "followers",
        },
      },

      // Filter only accepted ones
      {
        $addFields: {
          postsCount: { $size: "$posts" },
          followersCount: {
            $size: {
              $filter: {
                input: "$followers",
                as: "f",
                cond: { $eq: ["$$f.status", "accepted"] },
              },
            },
          },
          followingCount: {
            $size: {
              $filter: {
                input: "$following",
                as: "f",
                cond: { $eq: ["$$f.status", "accepted"] },
              },
            },
          },
        },
      },

      // Remove unnecessary fields
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

  // Updating profile details of the logged in user
  static async updateProfileDetails(userId, updateData) {

    const user = await User.findById(userId);
    if (!user) return false;
    
    if (updateData.removeProfile) {
      if (user.profilePicture) {
        await deletePostFromGCS(user.profilePicture);
      }
      updateData.profilePicture = "";
    }

    else if (updateData.profilePicture) {
      if (user.profilePicture) {
        await deletePostFromGCS(user.profilePicture);
      }
    }

    delete updateData.removeProfile;
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Getting Logged In user profile details (followers, following, posts count...)
  static async getProfileDetails(id) {
    const userId = new mongoose.Types.ObjectId(id);
    const profileDetails = await User.aggregate([
      { $match: { _id: userId } },

      // Get user's posts
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postedBy",
          as: "posts",
        },
      },

      // Get all following (sent friend requests)
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "requester",
          as: "allFollowing",
        },
      },

      // Get all followers (received friend requests)
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "recipient",
          as: "allFollowers",
        },
      },

      // Filter only accepted ones from allFollowing and allFollowers
      {
        $addFields: {
          postsCount: { $size: "$posts" },
          following: {
            $filter: {
              input: "$allFollowing",
              as: "f",
              cond: { $in: ["$$f.status", ["accepted", "pending"]] },
            },
          },
          followers: {
            $filter: {
              input: "$allFollowers",
              as: "f",
              cond: { $eq: ["$$f.status", "accepted"] },
            },
          },
        },
      },

      // Count filtered results
      {
        $addFields: {
          followingCount: { $size: "$following" },
          followersCount: { $size: "$followers" },
        },
      },

      // Project final result
      {
        $project: {
          bio: 1,
          username: 1,
          firstName: 1,
          lastName: 1,
          profilePicture: 1,
          posts: 1,
          postsCount: 1,
          followers: 1,
          following: 1,
          followersCount: 1,
          followingCount: 1,
        },
      },
    ]);
    return profileDetails?.[0] || false;
  }
}

export default UserRepository;
