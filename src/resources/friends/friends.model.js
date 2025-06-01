import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friends = new mongoose.model("Friends", friendSchema);
export default Friends;
