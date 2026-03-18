const pool = require("../dbconnect.js");

/**
 * this takes the cd comp data from
 * the form and does a db insert
 * @param {Event} e
 * @typedef {object} compsData
 * @property {string} title
 * @property {number} year
 * @property {string} location
 * @property {string[]} tracks
 * @returns {number}
 */
async function handleCdComps(e, compsData) {
  const { title, year, location, tracks } = compsData;

  try {
    // BEGIN transaction
    await pool.query("BEGIN");

    // send title info and get an id for the tracks insert
    const titleRes = await pool.query(
      "INSERT INTO cd_compilations(title, year, location) VALUES($1, $2, $3) RETURNING title_id",
      [title, year, location],
    );
    const titleId = titleRes.rows[0].title_id;

    // loop through the tracks and create the parmeters array for the insert
    const tracksInsertVals = [];
    tracks.forEach((tr) => {
      const artist = tr[0];
      const trackName = tr[1];
      tracksInsertVals.push(artist, trackName, titleId);
    });

    // construct the variables string for the tracks insert
    let paramVarsStr = "";
    for (let i = 1; i < tracksInsertVals.length; i += 3) {
      paramVarsStr += `($${i},$${i + 1},$${i + 2})`;
      if (i < tracksInsertVals.length - 3) {
        paramVarsStr += ",";
      }
    }

    // insert the tracks and commit transaction
    try {
      await pool.query(
        `INSERT INTO cd_compilations_tracks(artist, track_name, title_id) VALUES ${paramVarsStr}`,
        [...tracksInsertVals],
      );

      // COMMIT tranaction
      await pool.query("COMMIT");

      console.log(`${title} has been committed to the DB.`);
      return titleId;
    } catch (error) {
      await pool.query("ROLLBACK");
      console.log(error);
      return;
    }
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
  }
}

module.exports = handleCdComps;
