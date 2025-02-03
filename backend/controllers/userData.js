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

    const result = await pool.query(
      "INSERT INTO user_data (encrypted_data) VALUES ($1) RETURNING id",
      [encrypted]
    );

    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getRecord = async (req, res) => {
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

    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
