import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/CatchAsync.js";
import FriendsRepository from "./friends.repository.js";

export default class FriendsController {
  static getSuggestedFriends = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const suggestedFriends = await FriendsRepository.getSuggestedFriends(
      userId
    );
    if (suggestedFriends.length == 0) {
      return res.status(200).json({
        success: true,
        status: "No people on this application yet.",
      });
    }
    res.status(200).json({
      success: true,
      status: "Suggested users fetched successfully...",
      suggestedFriends,
    });
  });
}
