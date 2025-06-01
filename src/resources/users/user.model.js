import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please type in your first name."],
    },

    lastName: {
      type: String,
      trim: true,
      required: [true, "Please type in your last name."],
    },

    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username let's the users find you around the world."],
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Your email is precious for every vital action."],
    },

    password: {
      type: String,
      trim: true,
      select: false,
      required: [true, "Don't forget to enter your password."],
      minLength: [7, "Password must be atleast of 7 letters."],
    },

    confirmPassword: {
      type: String,
      trim: true,
      validate: {
        validator(password) {
          return this.password === password;
        },
        message: "Passwords do not match!!",
      },
    },

    mobile: {
      type: Number,
      trim: true,
      unique: true,
      required: [true, "Your contact let's us recover your account."],
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = null;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (
  userPassword,
  enteredPassword
) {
  return await bcrypt.compare(userPassword, enteredPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(16).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
