const mongoose = require("mongoose");
const { AUDIT_ACTIONS } = require("../constants");

const payoutAuditSchema = new mongoose.Schema(
  {
    payout_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payout",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(AUDIT_ACTIONS),
      required: true,
    },
    performed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PayoutAudit = mongoose.model("PayoutAudit", payoutAuditSchema);

module.exports = PayoutAudit;
