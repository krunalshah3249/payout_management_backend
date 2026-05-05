const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required.");
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new ApiError(500, "JWT_SECRET is not configured.");
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  next();
});

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not allowed to perform this action."));
  }

  return next();
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
