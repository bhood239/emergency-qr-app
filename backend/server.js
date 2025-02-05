require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./config/db");
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8081", "exp://192.168.1.81:8081"], // Update with your Expo URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const apiRouter = require("./routes/api");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api", apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
