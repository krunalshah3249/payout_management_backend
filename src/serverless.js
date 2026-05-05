const app = require("./app");
const { connectDb } = require("./config/db");

module.exports = async (req, res) => {
  await connectDb();
  return app(req, res);
};
