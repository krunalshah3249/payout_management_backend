const { login } = require("../services/auth.service");

const loginController = async (req, res) => {
  const result = await login(req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
};

module.exports = {
  loginController,
};
