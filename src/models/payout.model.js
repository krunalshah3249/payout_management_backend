const mongoose = require("mongoose");
const { PAYOUT_MODES, PAYOUT_STATUS } = require("../constants");

const payoutSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    mode: {
      type: String,
      enum: Object.values(PAYOUT_MODES),
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PAYOUT_STATUS),
      default: PAYOUT_STATUS.DRAFT,
    },
    decision_reason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

const Payout = mongoose.model("Payout", payoutSchema);

module.exports = Payout;
