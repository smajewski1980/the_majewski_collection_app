const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("node:path");
const { app } = require("electron/main");

// determine the correct path for the .env
const envPath = app.isPackaged
  ? path.join(process.resourcesPath, ".env")
  : path.join(__dirname, ".env");

// load the environment variables
dotenv.config({ path: envPath });

// postgres credentials
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
