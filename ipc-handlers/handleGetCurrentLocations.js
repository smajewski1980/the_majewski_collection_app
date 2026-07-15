const pool = require("../dbconnect.js");

async function handleGetCurrentLocations(e) {
  try {
    // const tapesResult = await pool.query(
    //   "SELECT * FROM current_tapes_locations",
    // );
    // const recordsResult = await pool.query(
    //   "SELECT * FROM current_records_locations",
    // );
    // const cdsResult = await pool.query("SELECT * FROM current_cds_locations");
    // const cdSinglesResult = await pool.query(
    //   "SELECT * FROM current_cd_singles_locations",
    // );
    // const cdCompsResult = await pool.query(
    //   "SELECT * FROM current_cd_comps_locations",
    // );

    // const locationData = {
    //   tapes: tapesResult.rows,
    //   records: recordsResult.rows,
    //   cds: cdsResult.rows,
    //   cdComps: cdCompsResult.rows,
    //   cdSingles: cdSinglesResult.rows,
    // };

    const [
      highLocCdCompsRaw,
      highLocCdSinglesRaw,
      highLocCdsRaw,
      highLocRecordsRaw,
      highLocTapesRaw,
    ] = await Promise.all([
      pool.query("SELECT * FROM curr_high_locs_cd_comps"),
      pool.query("SELECT * FROM curr_high_locs_cd_singles"),
      pool.query("SELECT * FROM curr_high_locs_cds"),
      pool.query("SELECT * FROM curr_high_locs_records"),
      pool.query("SELECT * FROM curr_high_locs_tapes"),
    ]);

    const highLocCdComps = highLocCdCompsRaw.rows.map(
      (r) => r.highest_location,
    );
    const highLocCdSingles = highLocCdSinglesRaw.rows.map(
      (r) => r.highest_location,
    );
    const highLocCds = highLocCdsRaw.rows.map((r) => r.highest_location);
    const highLocRecords = highLocRecordsRaw.rows.map(
      (r) => r.highest_location,
    );
    const highLocTapes = highLocTapesRaw.rows.map((r) => r.highest_location);

    const highLocData = {
      highLocCdComps,
      highLocCdSingles,
      highLocCds,
      highLocRecords,
      highLocTapes,
    };

    return JSON.stringify(highLocData);
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleGetCurrentLocations;
