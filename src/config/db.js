const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not configured. Set MONGODB_URI in Vercel environment variables."
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!global.__mongooseConnectionPromise) {
    global.__mongooseConnectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    global.__mongooseConnectionPromise.catch((err) => {
      console.error("MongoDB connection failed:", err.message || err);
      delete global.__mongooseConnectionPromise;
    });
  }

  await global.__mongooseConnectionPromise;
  return mongoose.connection;
};

module.exports = { connectDb };
