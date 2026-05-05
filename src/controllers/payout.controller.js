const {
  createPayout,
  getPayouts,
  getPayoutById,
  submitPayout,
  approvePayout,
  rejectPayout,
} = require("../services/payout.service");

const listPayoutsController = async (req, res) => {
  const payouts = await getPayouts({
    status: req.query.status,
    vendor_id: req.query.vendor,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.status(200).json({
    success: true,
    data: payouts,
  });
};

const createPayoutController = async (req, res) => {
  const payout = await createPayout({
    userId: req.user.id,
    payload: req.body,
  });
  res.status(201).json({
    success: true,
    data: payout,
  });
};

const getPayoutDetailsController = async (req, res) => {
  const result = await getPayoutById(req.params.id);
  res.status(200).json({
    success: true,
    data: result,
  });
};

const submitPayoutController = async (req, res) => {
  const payout = await submitPayout({
    id: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({
    success: true,
    data: payout,
  });
};

const approvePayoutController = async (req, res) => {
  const payout = await approvePayout({
    id: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({
    success: true,
    data: payout,
  });
};

const rejectPayoutController = async (req, res) => {
  const payout = await rejectPayout({
    id: req.params.id,
    userId: req.user.id,
    decision_reason: req.body.decision_reason,
  });
  res.status(200).json({
    success: true,
    data: payout,
  });
};

module.exports = {
  listPayoutsController,
  createPayoutController,
  getPayoutDetailsController,
  submitPayoutController,
  approvePayoutController,
  rejectPayoutController,
};
