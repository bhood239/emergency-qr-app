// migrations/002_create_users_table.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

const createUsersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Add user_id foreign key to user_data
    await client.query(`
      ALTER TABLE user_data
      ADD COLUMN IF NOT EXISTS user_id UUID 
      REFERENCES users(id) ON DELETE CASCADE
    `);

    await client.query("COMMIT");
    console.log("Migration 002 completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration 002 failed:", err);
  } finally {
    client.release();
    pool.end();
  }
};

createUsersTable();
