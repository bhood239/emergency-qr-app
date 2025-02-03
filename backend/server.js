require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./config/db");
const CryptoJS = require("crypto-js");
const app = express();
const apiRouter = require("./routes/api");

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// Routes
app.use("/api", apiRouter);

app.get("/record/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM user_data WHERE id = $1", [
      id,
    ]);

    if (!result.rows[0]) return res.status(404).send("Not found");

    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(
      result.rows[0].encrypted_data,
      process.env.SECRET_KEY
    );
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    res.render("record", { data });
  } catch (err) {
    console.error("Error:", err); // Add logging
    res.status(500).send("Invalid record");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
