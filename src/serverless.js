const app = require("./app");
const { connectDb } = require("./config/db");

module.exports = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error("Serverless DB connection error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: { message: "Unable to connect to database." },
    });
  }
};
