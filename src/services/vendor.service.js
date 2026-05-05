const Vendor = require("../models/vendor.model");
const ApiError = require("../utils/apiError");

const getVendors = async () => Vendor.find().sort({ createdAt: -1 });

const createVendor = async ({ name, upi_id, bank_account, ifsc, is_active }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Vendor name is required.");
  }

  const payload = {
    name: name.trim(),
    upi_id: upi_id || null,
    bank_account: bank_account || null,
    ifsc: ifsc || null,
  };

  if (typeof is_active === "boolean") {
    payload.is_active = is_active;
  }

  return Vendor.create(payload);
};

module.exports = {
  getVendors,
  createVendor,
};
