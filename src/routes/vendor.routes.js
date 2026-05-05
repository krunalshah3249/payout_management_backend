const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getVendorsController,
  createVendorController,
} = require("../controllers/vendor.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(asyncHandler(getVendorsController)).post(asyncHandler(createVendorController));

module.exports = router;
