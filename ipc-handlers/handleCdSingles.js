const pool = require("../dbconnect.js");

async function handleCdSingles(e, singlesData) {
  const { artist, title, year, caseType, tracks } = singlesData;

  try {
    // begin transaction
    await pool.query("BEGIN");
    // insert single and get id for track insert
    const result = await pool.query(
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
      await pool.query(
        `INSERT INTO cd_singles_tracks(track_name, single_id) VALUES${queryVars}`,
        [...tracksArray],
      );

      // commit transaction and return id
      await pool.query("COMMIT");
      console.log(`Single ${title} by ${artist} has been committed to the db.`);
      return singleId;
    } catch (error) {
      await pool.query("ROLLBACK");
      console.log(error);
      return;
    }
  } catch (error) {
    console.log(error);
    await pool.query("ROLLBACK");
  }
}

module.exports = handleCdSingles;
