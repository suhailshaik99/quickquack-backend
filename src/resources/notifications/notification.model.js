import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A sender is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A receiver is required"],
    },
    type: {
      type: String,
      enum: ["like", "comment", "friend-request", "new-post"],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
    actionAt: String,
    fullTime: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Efficient for: fetching latest notifications of a user
notificationSchema.index({ recipient: 1, createdAt: -1 });
// Efficient for: counting unread notifications for a user
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
