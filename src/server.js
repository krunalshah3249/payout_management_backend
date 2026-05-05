require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");

const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
