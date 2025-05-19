import catchAsync from "../../utils/CatchAsync.js";
import LikesRepository from "./likes.repository.js";

export default class LikesController {
  static likePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.id;
    const like = await LikesRepository.createLike(userId, postId);
    res.status(200).json({
      success: true,
      status: "Post Liked Successfully",
    });
  });

  static unLikePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.id;
    const unLike = await LikesRepository.deleteLike(userId, postId);
    res.status(200).json({
      success: true,
      status: "Like deleted successfully",
    });
  });
}
