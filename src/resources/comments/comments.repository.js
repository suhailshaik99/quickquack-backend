import Comments from "./comments.model.js";

export default class CommentsRepository {
  static async getComments(postId, userId) {
    return await Comments.find({ postId })
      .populate("userId", "profilePicture username")
      .sort({ createdAt: -1 });
  }

  static async createComment(userId, postId, comment) {
    return await Comments.create({ userId, postId, comment });
  }

  static async deleteComment(userId, postId, comment) {
    return await Comments.deleteOne({ userId, postId, comment });
  }
}
