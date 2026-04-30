const pool = require("../dbconnect.js");

/**
 * this takes the tape data from
 * the form and does a db update
 * @param {Event} e
 * @typedef {object} tapeData
 * @property {string} id
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @property {number} year
 * @property {string} needsRepair
 * @property {string} speed
 * @returns {number}
 */
async function handleUpdateTape(e, tapeData) {
  const { artist, title, location, year, needsRepair, speed, id } = tapeData;

  try {
    const res = await pool.query(
      "UPDATE tapes SET artist = $1, title = $2, location = $3, year = $4, needs_repair = $5, speed = $6 WHERE id = $7",
      [artist, title, location, year, needsRepair, speed, parseInt(id)],
    );

    console.log(`Id ${id} was updated successfully.`);

    return res.rowCount;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = handleUpdateTape;
