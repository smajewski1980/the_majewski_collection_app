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

    const cdsJson = JSON.stringify(cdsRaw.rows);
    const tapesJson = JSON.stringify(tapesRaw.rows);
    const recordsJson = JSON.stringify(recordsRaw.rows);
    const cdCompsJson = JSON.stringify(cdCompsRaw.rows);
    const cdSinglesJson = JSON.stringify(cdSinglesRaw.rows);
    const cdCompsTracksJson = JSON.stringify(cdCompsTracksRaw.rows);
    const cdSinglesTracksJson = JSON.stringify(cdSinglesTracksRaw.rows);

    const now = new Date(Date.now());
    const filenameSuffix = now.toISOString().split(".")[0].replaceAll(":", "_");
    const newDir = `${filenameSuffix}-update-files`;

    const cdsFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `CDS.json`,
    );
    const tapesFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `TAPES.json`,
    );
    const recordsFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `RECORDS.json`,
    );
    const cdCompsFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `CD_COMPS.json`,
    );
    const cdSinglesFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `CD_SINGLES.json`,
    );
    const cdCompsTracksFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `CD_COMPS_TRACKS.json`,
    );
    const cdSinglesTracksFilepath = path.join(
      app.getPath("userData"),
      "web-updates",
      newDir,
      `CD_SINGLES_TRACKS.json`,
    );

    try {
      fs.mkdirSync(path.join(app.getPath("userData"), "web-updates"), {
        recursive: true,
      });
      fs.mkdirSync(path.join(app.getPath("userData"), "web-updates", newDir), {
        recursive: true,
      });

      fs.writeFileSync(cdsFilepath, cdsJson);
      fs.writeFileSync(tapesFilepath, tapesJson);
      fs.writeFileSync(recordsFilepath, recordsJson);
      fs.writeFileSync(cdCompsFilepath, cdCompsJson);
      fs.writeFileSync(cdSinglesFilepath, cdSinglesJson);
      fs.writeFileSync(cdCompsTracksFilepath, cdCompsTracksJson);
      fs.writeFileSync(cdSinglesTracksFilepath, cdSinglesTracksJson);

      // may want to loop through and delete old ones when we do this....
    } catch (error) {
      console.log(error);
    }

    return "this will be success msg when we are done";
  } catch (err) {
    console.log(err);
  }
}

module.exports = handleGetWebUpdateData;

// need to query the 7 datasets
// need to convert them to JSON
// need to save them to the correct folder in the other project
// finish the website and set up ci/cd
// need to push the changes to git hub
