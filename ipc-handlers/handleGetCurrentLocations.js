const pool = require("../dbconnect.js");

async function handleGetCurrentLocations(e) {
  try {
    const tapesResult = await pool.query(
      "SELECT * FROM current_tapes_locations",
    );
    const recordsResult = await pool.query(
      "SELECT * FROM current_records_locations",
    );
    const cdsResult = await pool.query("SELECT * FROM current_cds_locations");
    const cdSinglesResult = await pool.query(
      "SELECT * FROM current_cd_singles_locations",
    );
    const cdCompsResult = await pool.query(
      "SELECT * FROM current_cd_comps_locations",
    );

    const locationData = {
      tapes: tapesResult.rows,
      records: recordsResult.rows,
      cds: cdsResult.rows,
      cdComps: cdCompsResult.rows,
      cdSingles: cdSinglesResult.rows,
    };
    return JSON.stringify(locationData);
  } catch (error) {
    next(new Error(error));
  }
}

module.exports = handleGetCurrentLocations;
