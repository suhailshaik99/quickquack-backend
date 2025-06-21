import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/CatchAsync.js";
import SearchRepository from "./search.repository.js";

export default class SearchController {
  static searchUsers = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const { username } = req.query;

    if (!username) {
      return next(
        new AppError("username is required to perform the search", 400)
      );
    }

    const terms = username
      .split(/[\s_]+/)
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    const regexArray = terms.map((term) => ({
      username: { $regex: term, $options: "i" },
    }));

    const searchResults = await SearchRepository.searchUsers(
      userId,
      regexArray
    );

    if (searchResults.length == 0) {
      return res.status(200).json({
        success: true,
        status: "No users found with the entered username",
        searchResults,
      });
    }
    res.status(200).json({
      success: true,
      status: "Fetched users successfully!",
      searchResults,
    });
  });
}
