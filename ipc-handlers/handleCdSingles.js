const pool = require("../dbconnect.js");

/**
 * this takes the cd single data from
 * the form and does a db insert
 * @param {Event} e
 * @typedef {object} singlesData
 * @property {string} artist
 * @property {string} title
 * @property {number} year
 * @property {string} caseType
 * @property {string[]} tracks
 * @returns {number}
 */
async function handleCdSingles(e, singlesData) {
  const { artist, title, year, caseType, tracks } = singlesData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // insert single and get single id for track insert
    const result = await client.query(
      "INSERT INTO cd_singles(artist, title, year, case_type) VALUES($1, $2, $3, $4) RETURNING single_id",
      [artist, title, year, caseType],
    );
    const singleId = result.rows[0].single_id;

    // construct a formatted array to use in the query
    const tracksArray = [];
    let queryVars = "";
    tracks.forEach((tr) => {
      tracksArray.push(tr, singleId);
    });
    for (let i = 1; i < tracksArray.length; i += 2) {
      queryVars += `($${i}, $${i + 1})`;
      if (i < tracksArray.length - 1) {
        queryVars += ",";
      }
    }

    // insert track info
    try {
      await client.query(
        `INSERT INTO cd_singles_tracks(track_name, single_id) VALUES${queryVars}`,
        [...tracksArray],
      );

      // commit transaction and return id
      await client.query("COMMIT");
      console.log(`Single ${title} by ${artist} has been committed to the db.`);
      return singleId;
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
      return;
    }
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
}

module.exports = handleCdSingles;
