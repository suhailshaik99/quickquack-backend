import FriendsRepository from "../resources/friends/friends.repository.js";

export default function getOnlineUsers(io, socket, onlineUsers) {
  socket.on("get-online-friends", async (userId) => {
    if (!userId) return;

    const { followers = [], following = [] } =
      await FriendsRepository.getFriends(userId);
    const allFriendsMap = new Map();

    [...followers, ...following].forEach((friend) => {
      const id = friend._id.toString();
      allFriendsMap.set(id, friend);
    });

    const onlineFriends = Array.from(allFriendsMap.values()).filter((friend) =>
      onlineUsers.has(friend._id.toString())
    );

    socket.emit("online-friends-response", onlineFriends);
  });
}
