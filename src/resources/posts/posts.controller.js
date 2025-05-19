import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/CatchAsync.js";
import PostsRepository from "./posts.repository.js";

class PostsController {
  static getPostsByUserId = catchAsync(async (req, res, next) => {
    const posts = await PostsRepository.getPostsByUserId(req.id);
    if (posts.length == 0) {
      return res.status(200).json({
        success: true,
        status: "No posts yet to show",
        posts,
      });
    }
    return res.status(200).json({
      success: true,
      status: "Posts Fetched Successfully..!",
      posts,
    });
  });

  static createPost = catchAsync(async (req, res, next) => {
    if (!req.file || !req.file.cloudStorageURL) {
      return next(new AppError("No post(s) selected to upload", 400));
    }

    const { description, location } = req.body;
    const postUrl = req.file?.cloudStorageURL;
    const post = await PostsRepository.createPost({
      description,
      location,
      postUrl,
      postedBy: req.id,
    });
    if (!post) {
      return next(new AppError("Error uploading post", 500));
    }
    return res.status(200).json({
      success: true,
      status: "Post Uploaded",
    });
  });
}

export default PostsController;
