const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const vendorRoutes = require("./routes/vendor.routes");
const payoutRoutes = require("./routes/payout.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

app.use("/auth", authRoutes);
app.use("/vendors", vendorRoutes);
app.use("/payouts", payoutRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found.",
    },
  });
});

app.use(errorMiddleware);

module.exports = app;
