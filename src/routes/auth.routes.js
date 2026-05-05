const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { loginController } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", asyncHandler(loginController));

module.exports = router;
