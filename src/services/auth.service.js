const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new ApiError(500, "JWT_SECRET is not configured.");
  }

  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1d" });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  login,
};
