import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/CatchAsync.js";
import MessagesRepository from "./messages.repository.js";

export default class MessagesController {
  static getMessages = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const messages = await MessagesRepository.getMessages(userId);
    return res.status(200).json({
      success: true,
      status: "Message cards fetched successfully",
      messages,
    });
  });

  static getUserMessages = catchAsync(async (req, res, next) => {
    const sender = req.id;
    const { receiver } = req.params;
    const userMessages = await MessagesRepository.getUserMessages(
      sender,
      receiver
    );
    if (userMessages.length == 0) {
      return next(new AppError("No messages yet in this chat", 200));
    }
    return res.status(200).json({
      success: true,
      status: "conversation messages fetched successfully",
      userMessages,
    });
  });

  static createMessage = catchAsync(async (req, res, next) => {});

  static editMessage = catchAsync(async (req, res, next) => {});

  static deleteMessage = catchAsync(async (req, res, next) => {});
}
