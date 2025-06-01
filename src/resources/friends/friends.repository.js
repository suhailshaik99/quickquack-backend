import User from "../users/user.model.js";
import Friends from "./friends.model.js";

export default class FriendsRepository {
  static async getSuggestedFriends(userId) {
    // Collecting all the friends of the userId.
    const friends = await Friends.find({
      status: "accepted",
      $or: [{ requester: userId, recepient: userId }],
    });
    // If user has no friends
    if (friends.length == 0) {
      const suggestedFriends = await User.find(
        { _id: { $ne: userId } },
        { username: 1, profilePicture: 1 }
      );
      return suggestedFriends;
    }
    // Gathering only ids of connected users.
    const connectedIds = friends.map((f) =>
      f.requester.equals(userId) ? f.recepient : f.requester
    );
    console.log(connectedIds);
    // Filtering users who are not connected
    const suggestedUsers = await Friends.find({
      _id: { $nin: [userId, ...connectedIds] },
    });
    console.log(suggestedUsers);
    return suggestedUsers;
  }
}
