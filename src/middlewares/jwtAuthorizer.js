import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import Logout from "../resources/logout/logout.model.js";

function jwtAuthorizer(req, res, next) {
  const { jwtToken: token } = req.cookies;

  // Token Existence Check
  if (!token) {
    return next(
      new AppError("You are not logged In, Please login to continue.", 401)
    );
  }

  // Decoding token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return next(
        new AppError("Cannot Authenticate user at the moment..", 401)
      );
    }
    req.id = decode.id;
    const tokenInvalidStatus = await Logout.findOne({ userId: req.id, token });
    if (tokenInvalidStatus) {
      return next(
        new AppError("You were logged out, Please login to continue", 401)
      );
    } else {
      next();
    }
  });
}

export default jwtAuthorizer;
