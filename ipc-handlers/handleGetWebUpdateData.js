const pool = require("../dbconnect.js");
const path = require("node:path");
const fs = require("node:fs");
const { app } = require("electron/main");

const queryCds = "SELECT * FROM cds ORDER BY artist, title";
const queryTapes = "SELECT * FROM tapes ORDER BY artist, title";
const queryRecords = "SELECT * FROM records ORDER BY artist, title";
const queryCdComps = "SELECT * FROM cd_compilations ORDER BY title";
const queryCdSingles = "SELECT * FROM cd_singles ORDER BY artist, title";
const queryCdCompsTracks =
  "SELECT * FROM cd_compilations_tracks ORDER BY title_id";
const queryCdSinglesTracks =
  "SELECT * FROM cd_singles_tracks ORDER BY single_id";

async function handleGetWebUpdateData() {
  try {
    // fetch the individual queries
    const [
      cdsRaw,
      tapesRaw,
      recordsRaw,
      cdCompsRaw,
      cdSinglesRaw,
      cdCompsTracksRaw,
      cdSinglesTracksRaw,
    ] = await Promise.all([
      pool.query(queryCds),
      pool.query(queryTapes),
      pool.query(queryRecords),
      pool.query(queryCdComps),
      pool.query(queryCdSingles),
      pool.query(queryCdCompsTracks),
      pool.query(queryCdSinglesTracks),
    ]);

    // convert to JSON
    const cdsJson = JSON.stringify(cdsRaw.rows);
    const tapesJson = JSON.stringify(tapesRaw.rows);
    const recordsJson = JSON.stringify(recordsRaw.rows);
    const cdCompsJson = JSON.stringify(cdCompsRaw.rows);
    const cdSinglesJson = JSON.stringify(cdSinglesRaw.rows);
    const cdCompsTracksJson = JSON.stringify(cdCompsTracksRaw.rows);
    const cdSinglesTracksJson = JSON.stringify(cdSinglesTracksRaw.rows);

    // prepare the directory path

    const dirPath = path.join(
      app.getPath("desktop"),
      "tmc",
      "my_music_collection_v3",
      "src",
      "data",
    );

    // the individual final paths
    const cdsFilepath = path.join(dirPath, "CDS.json");
    const tapesFilepath = path.join(dirPath, "TAPES.json");
    const recordsFilepath = path.join(dirPath, "RECORDS.json");
    const cdCompsFilepath = path.join(dirPath, "CD_COMPS.json");
    const cdSinglesFilepath = path.join(dirPath, "CD_SINGLES.json");
    const cdCompsTracksFilepath = path.join(dirPath, "CD_COMPS_TRACKS.json");
    const cdSinglesTracksFilepath = path.join(
      dirPath,
      "CD_SINGLES_TRACKS.json",
    );

    try {
      // write the data
      fs.writeFileSync(cdsFilepath, cdsJson);
      fs.writeFileSync(tapesFilepath, tapesJson);
      fs.writeFileSync(recordsFilepath, recordsJson);
      fs.writeFileSync(cdCompsFilepath, cdCompsJson);
      fs.writeFileSync(cdSinglesFilepath, cdSinglesJson);
      fs.writeFileSync(cdCompsTracksFilepath, cdCompsTracksJson);
      fs.writeFileSync(cdSinglesTracksFilepath, cdSinglesTracksJson);
      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = handleGetWebUpdateData;

// need to query the 7 datasets - done
// need to convert them to JSON - done
// need to save them to the correct folder in the other project - done

// finish the website and set up ci/cd
// need to push the changes to git hub
