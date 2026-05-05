const mongoose = require("mongoose");
const Payout = require("../models/payout.model");
const PayoutAudit = require("../models/payout-audit.model");
const Vendor = require("../models/vendor.model");
const ApiError = require("../utils/apiError");
const { AUDIT_ACTIONS, PAYOUT_MODES, PAYOUT_STATUS } = require("../constants");

const validateObjectId = (id, field) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${field} is invalid.`);
  }
};

const writeAudit = async ({ payout_id, action, performed_by }) => {
  await PayoutAudit.create({ payout_id, action, performed_by });
};

const createPayout = async ({ userId, payload }) => {
  const { vendor_id, amount, mode, note } = payload;

  if (!vendor_id) {
    throw new ApiError(400, "vendor_id is required.");
  }
  validateObjectId(vendor_id, "vendor_id");

  if (typeof amount !== "number" || amount <= 0) {
    throw new ApiError(400, "amount must be greater than 0.");
  }

  if (!mode || !Object.values(PAYOUT_MODES).includes(mode)) {
    throw new ApiError(400, "mode must be one of UPI, IMPS, or NEFT.");
  }

  const vendor = await Vendor.findById(vendor_id);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found.");
  }

  const payout = await Payout.create({
    vendor_id,
    amount,
    mode,
    note: note || null,
    status: PAYOUT_STATUS.DRAFT,
  });

  await writeAudit({
    payout_id: payout._id,
    action: AUDIT_ACTIONS.CREATED,
    performed_by: userId,
  });

  return payout;
};

const getPayouts = async ({ status, vendor_id, page = 1, limit = 10 }) => {
  const query = {};

  if (status) {
    if (!Object.values(PAYOUT_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid status filter.");
    }
    query.status = status;
  }

  if (vendor_id) {
    validateObjectId(vendor_id, "vendor");
    query.vendor_id = vendor_id;
  }

  const currentPage = Number(page);
  const perPage = Number(limit);

  if (!Number.isInteger(currentPage) || currentPage < 1) {
    throw new ApiError(400, "page must be a positive integer.");
  }
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
    throw new ApiError(400, "limit must be between 1 and 100.");
  }

  const skip = (currentPage - 1) * perPage;
  const [items, total] = await Promise.all([
    Payout.find(query).populate("vendor_id").sort({ createdAt: -1 }).skip(skip).limit(perPage),
    Payout.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage) || 1,
    },
  };
};

const getPayoutById = async (id) => {
  validateObjectId(id, "id");
  const payout = await Payout.findById(id).populate("vendor_id");
  if (!payout) {
    throw new ApiError(404, "Payout not found.");
  }

  const audits = await PayoutAudit.find({ payout_id: id })
    .populate("performed_by", "email role")
    .sort({ createdAt: 1 });

  return { payout, audits };
};

const submitPayout = async ({ id, userId }) => {
  const payout = await Payout.findById(id);
  if (!payout) {
    throw new ApiError(404, "Payout not found.");
  }
  if (payout.status !== PAYOUT_STATUS.DRAFT) {
    throw new ApiError(400, "Only Draft payout can be submitted.");
  }

  payout.status = PAYOUT_STATUS.SUBMITTED;
  await payout.save();

  await writeAudit({
    payout_id: payout._id,
    action: AUDIT_ACTIONS.SUBMITTED,
    performed_by: userId,
  });

  return payout;
};

const approvePayout = async ({ id, userId }) => {
  const payout = await Payout.findById(id);
  if (!payout) {
    throw new ApiError(404, "Payout not found.");
  }
  if (payout.status !== PAYOUT_STATUS.SUBMITTED) {
    throw new ApiError(400, "Only Submitted payout can be approved.");
  }

  payout.status = PAYOUT_STATUS.APPROVED;
  payout.decision_reason = null;
  await payout.save();

  await writeAudit({
    payout_id: payout._id,
    action: AUDIT_ACTIONS.APPROVED,
    performed_by: userId,
  });

  return payout;
};

const rejectPayout = async ({ id, userId, decision_reason }) => {
  if (!decision_reason || !decision_reason.trim()) {
    throw new ApiError(400, "decision_reason is required when rejecting payout.");
  }

  const payout = await Payout.findById(id);
  if (!payout) {
    throw new ApiError(404, "Payout not found.");
  }
  if (payout.status !== PAYOUT_STATUS.SUBMITTED) {
    throw new ApiError(400, "Only Submitted payout can be rejected.");
  }

  payout.status = PAYOUT_STATUS.REJECTED;
  payout.decision_reason = decision_reason.trim();
  await payout.save();

  await writeAudit({
    payout_id: payout._id,
    action: AUDIT_ACTIONS.REJECTED,
    performed_by: userId,
  });

  return payout;
};

module.exports = {
  createPayout,
  getPayouts,
  getPayoutById,
  submitPayout,
  approvePayout,
  rejectPayout,
};
