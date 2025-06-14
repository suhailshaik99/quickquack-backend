import catchAsync from "../../utils/CatchAsync.js";
import MessagesRepository from "./messages.repository.js";

export default class MessagesController {
  static getMessages = catchAsync(async (req, res, next) => {});

  static createMessage = catchAsync(async (req, res, next) => {});

  static editMessage = catchAsync(async (req, res, next) => {});

  static deleteMessage = catchAsync(async (req, res, next) => {});
};
