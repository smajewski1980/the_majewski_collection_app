const pool = require("../dbconnect.js");

async function handleInsertTapes(e, data) {
  const { artist, title, location, year, needsRepair, speed } = data;

  try {
    const result = await pool.query(
      "INSERT INTO tapes(artist, title, location, year, needs_repair, speed) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      [artist, title, location, year, needsRepair, speed],
    );
    console.log(`Tape ${title} by ${artist} has been added to the db.`);
    return result.rows[0].id;
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleInsertTapes;
