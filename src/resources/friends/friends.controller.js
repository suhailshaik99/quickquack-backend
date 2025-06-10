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
        suggestedFriends,
      });
    }

    res.status(200).json({
      success: true,
      status: "Suggested users fetched successfully...",
      suggestedFriends,
    });
  });

  static getFriendRequest = catchAsync(async (req, res, next) => {
    const recipient = req.id;
    const requests = await FriendsRepository.getFriendRequest(recipient);
    if (requests.length == 0) {
      return res.status(200).json({
        success: true,
        status: "No pending requests at the moment",
        requests,
      });
    }
    return res.status(200).json({
      success: true,
      status: "Pending requests fetched successfully",
      requests,
    });
  });

  static createFriendRequest = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const { recipient } = req.body;
    const data = {
      requester: userId,
      recipient,
    };

    const creationStatus = await FriendsRepository.createFriendRequest(data);
    if (!creationStatus)
      return new AppError("Unable to send request at the moment", 500);

    return res.status(201).json({
      success: true,
      status: "Friend Request sent successfully...",
    });
  });

  static confirmFriendRequest = catchAsync(async (req, res, next) => {
    const recipient = req.id;
    const { docId, requester } = req.body;
    const confirmStatus = await FriendsRepository.confirmFriendRequest(docId, {
      requester,
      recipient,
      status: "accepted",
    });
    if (!confirmStatus) {
      return next(new AppError("Error accepting request..", 500));
    }
    return res.status(201).json({
      success: true,
      status: "Responded to request successfully",
    });
  });

  static deleteFriendRequest = catchAsync(async (req, res, next) => {
    const recipient = req.id;
    const { requester } = req.body;
    const deletionStatus = await FriendsRepository.deleteFriendRequest({
      requester,
      recipient,
    });
    if (!deletionStatus) {
      return next(
        new AppError("Unable to respond to request at the moment", 500)
      );
    }
    return res.status(201).json({
      success: true,
      status: "Responded to request successfully",
    });
  });

  static cancelFriendRequest = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const { recipient } = req.body;
    const data = {
      requester: userId,
      recipient,
    };

    const deletionStatus = await FriendsRepository.cancelFriendRequest(data);
    if (!deletionStatus)
      return new AppError("Unable to cancel the request at the moment", 500);

    return res.status(200).json({
      success: true,
      status: "Friend Request deleted successfully...",
    });
  });
}
