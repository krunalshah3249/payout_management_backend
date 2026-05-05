require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDb } = require("../config/db");
const User = require("../models/user.model");
const { ROLES } = require("../constants");

const seedUsers = async () => {
  const users = [
    { email: "ops@demo.com", password: "ops123", role: ROLES.OPS },
    { email: "finance@demo.com", password: "fin123", role: ROLES.FINANCE },
  ];

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (existing) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.create({
      email: user.email,
      password: hashedPassword,
      role: user.role,
    });
  }
};

const run = async () => {
  try {
    await connectDb();
    await seedUsers();
    console.log("Seed completed.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
};

run();
