const pool = require("../dbconnect");

/**
 * this takes the cds main data from
 * the form and does a db update
 * @param {Event} e
 * @typedef {object} cdData
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @returns {number}
 */
async function handleUpdateCdMain(e, cdData) {
  const { id, artist, title, location } = cdData;

  try {
    const res = await pool.query(
      "UPDATE cds SET artist = $1, title = $2, location = $3 WHERE id = $4",
      [artist, title, location, parseInt(id)],
    );

    return res.rowCount;
  } catch (error) {
    console.log(error);
    return res;
  }
}

module.exports = handleUpdateCdMain;
