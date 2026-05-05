const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoUri = "mongodb+srv://krunalshah3249_db_user:V94OuTh6KaxXYEzv@payoutmanage.qjwu9i3.mongodb.net/?appName=payoutmanage";
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message || error);
    throw error;
  }
};

module.exports = { connectDb };
