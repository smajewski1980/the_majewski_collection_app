const pool = require("../dbconnect.js");

async function handleGetAllLocations(e) {
  try {
    const res = await pool.query("SELECT * FROM get_all_locations");

    return res.rows.map((r) => r.location);
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleGetAllLocations;
