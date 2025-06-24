import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/CatchAsync.js";
import LogoutRepository from "./logout.repository.js";

export default class LogoutController {
  static userLogout = catchAsync(async (req, res, next) => {
    const userId = req.id;
    const token = req.cookies.jwtToken;

    const logoutStatus = await LogoutRepository.userLogout({ userId, token });
    if (!logoutStatus) {
      return next(new AppError("Error logging out the user", 500));
    }
    res.clearCookie("jwtToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({
      success: true,
      status: "User logged out successfully",
    });
  });
}
