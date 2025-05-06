import AppError from "./AppError.js";

function handleDuplicateFields(error) {
  const field = Object.keys(error.keyValue)[0];
  const value = Object.values(error.keyValue)[0];
  if (field == "username") {
    return new AppError("Username not available", 400);
  }
  const message = `${field} ${value} already exists.`;
  return new AppError(message, 400);
}

function handleValidationError(error) {
  const message = Object.values(error.errors).map((err) => err.message);
  return new AppError(message, 400);
}

function sendError(error, res) {
  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    error: error.errors,
  });
}

export default function GlobalErrHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  if (err.code == 11000) err = handleDuplicateFields(err);
  if (err.name == "ValidationError") err = handleValidationError(err);

  sendError(err, res);
}
