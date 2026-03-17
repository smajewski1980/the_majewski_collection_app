const pool = require("../dbconnect.js");

/**
 * this takes the tape data from
 * the form and does a db insert
 * @param {Event} e
 * @typedef {object} tapeData
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @property {number} year
 * @property {string} needsRepair
 * @property {string} speed
 * @returns {number}
 */
async function handleInsertTapes(e, tapeData) {
  const { artist, title, location, year, needsRepair, speed } = tapeData;

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
