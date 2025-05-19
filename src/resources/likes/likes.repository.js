import Likes from "./likes.model.js";

export default class LikesRepository {
  static createLike = async (userId, postId) => {
    await Likes.create({ userId, postId });
  };

  static deleteLike = async (userId, postId) => {
    await Likes.deleteOne({ userId, postId });
  };
}
