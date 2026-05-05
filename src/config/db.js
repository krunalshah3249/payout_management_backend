const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!global.__mongooseConnectionPromise) {
    global.__mongooseConnectionPromise = mongoose.connect(mongoUri);
  }

  await global.__mongooseConnectionPromise;
  return mongoose.connection;
};

module.exports = { connectDb };
