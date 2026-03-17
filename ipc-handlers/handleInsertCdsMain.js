const pool = require("../dbconnect.js");

/**
 * this takes the cds main data from
 * the form and does a db insert
 * @param {Event} e
 * @typedef {object} cdData
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @returns {number}
 */
async function handleInsertCdsMain(e, cdData) {
  const { artist, title, location } = cdData;

  try {
    const result = await pool.query(
      "INSERT INTO cds(artist, title, location) VALUES($1, $2, $3) RETURNING id",
      [artist, title, location],
    );

    console.log(`Cd ${title} by ${artist} has been added to the db.`);

    return result.rows[0].id;
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleInsertCdsMain;
