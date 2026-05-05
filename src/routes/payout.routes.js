const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  listPayoutsController,
  createPayoutController,
  getPayoutDetailsController,
  submitPayoutController,
  approvePayoutController,
  rejectPayoutController,
} = require("../controllers/payout.controller");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants");

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(asyncHandler(listPayoutsController))
  .post(authorizeRoles(ROLES.OPS), asyncHandler(createPayoutController));

router.get("/:id", asyncHandler(getPayoutDetailsController));

router.post("/:id/submit", authorizeRoles(ROLES.OPS), asyncHandler(submitPayoutController));

router.post("/:id/approve", authorizeRoles(ROLES.FINANCE), asyncHandler(approvePayoutController));

router.post("/:id/reject", authorizeRoles(ROLES.FINANCE), asyncHandler(rejectPayoutController));

module.exports = router;
