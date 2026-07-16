const pool = require("../dbconnect.js");

async function handleGetCurrentLocations(e) {
  try {
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
