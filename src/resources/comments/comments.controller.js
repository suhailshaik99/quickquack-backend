import catchAsync from "../../utils/CatchAsync.js";
import CommentsRepository from "./comments.repository.js";

export default class CommentsController {
  static getComments = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.id;
    const comments = await CommentsRepository.getComments(postId, userId);
    res.status(200).json({
      success: true,
      status: "Comments fetched successfully",
      comments,
    });
  });

  static createComment = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.id;
    const { comment } = req.body;
    const status = await CommentsRepository.createComment(
      userId,
      postId,
      comment
    );
    res.status(201).json({
      success: true,
      status: "Posted comment successfully...",
    });
  });

  static deleteComment = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.id;
    const { comment } = req.body;
    const status = await CommentsRepository.deleteComment(
      userId,
      postId,
      comment
    );
    res.status(201).json({
      success: true,
      status: "Comment Deleted successfully....",
    });
  });
}
