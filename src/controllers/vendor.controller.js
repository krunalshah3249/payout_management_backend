const { getVendors, createVendor } = require("../services/vendor.service");

const getVendorsController = async (req, res) => {
  const vendors = await getVendors();
  res.status(200).json({
    success: true,
    data: vendors,
  });
};

const createVendorController = async (req, res) => {
  const vendor = await createVendor(req.body);
  res.status(201).json({
    success: true,
    data: vendor,
  });
};

module.exports = {
  getVendorsController,
  createVendorController,
};
