const pool = require("../dbconnect.js");

/**
 * this takes the cd comp data from
 * the form and does a db update
 * @param {Event} e
 * @typedef {object} compData
 * @property {string} title_id
 * @property {string} title
 * @property {string} year
 * @property {string} location
 * @property {string[]} tracks
 * @returns {number}
 */
async function handleUpdateCdComp(e, compData) {
  // console.log(compData);
  const { title_id, title, year, location } = compData;
  let { tracks } = compData;
  let newTracks = null;

  const client = await pool.connect();

  try {
    // get the track ids for the update
    const trackIdsRes = await client.query(
      "SELECT track_id FROM cd_compilations_tracks WHERE title_id = $1",
      [title_id],
    );
    const trackIds = trackIdsRes.rows.map((row) => row.track_id);

    if (!trackIds.length) return 0;

    // not sure if we need to worry about this one...
    if (tracks.length < trackIds.length) {
      throw new Error("Can not DELETE tracks here yet, only update or add.");
    }

    // if attempting to add additional tracks
    if (tracks.length > trackIds.length) {
      // separate the old tracks to update and the new to insert
      newTracks = tracks.slice(trackIds.length);
      tracks = tracks.slice(0, trackIds.length);
    }

    await client.query("BEGIN");

    // update the cd compilations table
    const titleRes = await client.query(
      "UPDATE cd_compilations SET title = $1, year = $2, location = $3 WHERE title_id = $4",
      [title, year, location, title_id],
    );

    // update the cd compilations tracks table

    // loop through the tracks and create the parmeters array for the insert
    const tracksInsertVals = [];
    let trackIdCounter = 0;
    tracks.forEach((tr) => {
      const trackId = trackIds[trackIdCounter];
      const artist = tr[0];
      const trackName = tr[1];
      tracksInsertVals.push(trackId, artist, trackName, title_id);
      trackIdCounter++;
    });

    // construct the variables string for the tracks insert
    let paramVarsStr = "";
    for (let i = 1; i < tracksInsertVals.length; i += 4) {
      paramVarsStr += `($${i},$${i + 1},$${i + 2},$${i + 3})`;
      if (i < tracksInsertVals.length - 3) {
        paramVarsStr += ",";
      }
    }

    try {
      const tracksRes = await client.query(
        `UPDATE cd_compilations_tracks as ct SET artist = vals.artist, track_name = vals.track_name, title_id = vals.title_id::int FROM (VALUES ${paramVarsStr}) AS vals(track_id, artist, track_name, title_id) WHERE ct.track_id = vals.track_id::int`,
        tracksInsertVals,
      );

      if (newTracks) {
        // loop through the tracks and create the parmeters array for the insert
        const newTrackInsertVals = [];
        newTracks.forEach((nt, idx) => {
          const artist = nt[0];
          const trackName = nt[1];
          newTrackInsertVals.push(artist, trackName, title_id);
        });
        // construct the variables string for the tracks insert
        let newTrackParamVarsStr = "";
        for (let i = 1; i < newTrackInsertVals.length; i += 3) {
          newTrackParamVarsStr += `($${i},$${i + 1},$${i + 2})`;
          if (i < newTrackInsertVals.length - 2) {
            newTrackParamVarsStr += ",";
          }
        }

        const newTracksRes = await client.query(
          `INSERT INTO cd_compilations_tracks (artist, track_name, title_id) VALUES ${newTrackParamVarsStr}`,
          newTrackInsertVals,
        );
        console.log("number of new tracks added: ", newTracksRes.rowCount);
      }

      await client.query("COMMIT");

      console.log("number of title rows updated: ", titleRes.rowCount);
      console.log("number of track rows updated: ", tracksRes.rowCount);

      return tracksRes.rowCount;
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
      return;
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return error;
  } finally {
    client.release();
  }
}

module.exports = handleUpdateCdComp;
