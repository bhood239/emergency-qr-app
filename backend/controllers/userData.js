const CryptoJS = require("crypto-js");
const { pool } = require("../config/db");

exports.createRecord = async (req, res) => {
  try {
    const { name, bloodType, allergies, emergencyContact } = req.body;
    const data = JSON.stringify({
      name,
      bloodType,
      allergies,
      emergencyContact,
    });

    // Encrypt data
    const encrypted = CryptoJS.AES.encrypt(
      data,
      process.env.SECRET_KEY
    ).toString();

    // Include user_id in the INSERT statement
    const result = await pool.query(
      "INSERT INTO user_data (user_id, encrypted_data) VALUES ($1, $2) RETURNING id",
      [req.user.id, encrypted]
    );

    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getRecord = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_data.* FROM user_data JOIN users ON users.id = user_data.user_id WHERE user_data.user_id = $1 LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows[0])
      return res.status(404).json({ error: "No records found" });

    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(
      result.rows[0].encrypted_data,
      process.env.SECRET_KEY
    );
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    res.json({ ...data, id: result.rows[0].id });
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bloodType, allergies, emergencyContact } = req.body;

    // Encrypt updated data
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({ name, bloodType, allergies, emergencyContact }),
      process.env.SECRET_KEY
    ).toString();

    const result = await pool.query(
      `UPDATE user_data
        SET encrypted_data = $1
        WHERE id = $2 AND user_id = $3
        RETURNING *`,
      [encrypted, id, req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Failed to update record" });
    console.log(err);
  }
};
