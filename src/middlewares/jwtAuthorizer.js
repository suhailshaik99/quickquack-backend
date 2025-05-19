import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

function jwtAuthorizer(req, res, next) {
  const { jwtToken: token } = req.cookies;
  if (!token) {
    return next(
      new AppError("You are not logged In, Please login to continue.", 401)
    );
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return next(
        new AppError("Cannot Authenticate user at the moment..", 401)
      );
    }
    req.id = decode.id;
    next();
  });
}

export default jwtAuthorizer;
