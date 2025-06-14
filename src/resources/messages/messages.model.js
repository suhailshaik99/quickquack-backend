import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Not a valid sender"],
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Not a valid receiver"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    },

    messageRead: {
      type: Boolean,
      default: false
    },

    messageSentAt: String,
    fullTime: String
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
