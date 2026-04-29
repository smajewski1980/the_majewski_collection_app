const pool = require("../dbconnect");

/**
 * this takes the cd single data from
 * the form and does a db update
 * @param {Event} e
 * @typedef {object} singleData
 * @property {string} single_id
 * @property {string} artist
 * @property {string} title
 * @property {string} year
 * @property {string} caseType
 * @property {string[]} tracks
 * @returns {number}
 */
async function handleUpdateCdSingle(e, singleData) {
  const { single_id, artist, title, year, caseType, tracks } = singleData;

  const client = await pool.connect();

  try {
    // get the track ids for the update
    const trackIdsRes = await client.query(
      "SELECT track_id FROM cd_singles_tracks WHERE single_id = $1",
      [single_id],
    );
    const trackIds = trackIdsRes.rows.map((row) => row.track_id);

    // if attempting to add additional tracks
    // will address this later
    if (tracks.length > trackIds.length) {
      throw new Error("Can not ADD tracks here yet, only update.");
    }

    await client.query("BEGIN");

    // update the single data
    const singleRes = await client.query(
      "UPDATE cd_singles SET artist = $1, title = $2, year = $3, case_type = $4 WHERE single_id = $5",
      [artist, title, year, caseType, single_id],
    );

    console.log("single update row count", singleRes.rowCount);

    // construct a formatted array to use in the update query
    const tracksArray = [];
    let queryVars = "";
    let trackIdCounter = 0;
    tracks.forEach((tr) => {
      tracksArray.push(tr, single_id, trackIds[trackIdCounter]);
      trackIdCounter++;
    });
    for (let i = 1; i < tracksArray.length; i += 3) {
      queryVars += `($${i}, $${i + 1}, $${i + 2})`;
      if (i < tracksArray.length - 2) {
        queryVars += ",";
      }
    }

    // update the tracks
    try {
      const tracksRes = await client.query(
        `UPDATE cd_singles_tracks as st SET track_name = vals.track_name, single_id = vals.single_id::int FROM (VALUES ${queryVars}) AS vals(track_name, single_id, track_id) WHERE st.track_id = vals.track_id::int`,
        tracksArray,
      );

      await client.query("COMMIT");

      console.log(`tracks updated: ${tracksRes.rowCount}`);
      return tracksRes.rowCount;
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
      return;
    }
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return error;
  } finally {
    client.release();
  }
}

module.exports = handleUpdateCdSingle;
