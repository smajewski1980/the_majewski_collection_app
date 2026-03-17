const pool = require("../dbconnect.js");

async function handleInsertCdsMain(e, data) {
  const { artist, title, location } = data;
  console.log(data);

  try {
    const result = await pool.query(
      "INSERT INTO cds(artist, title, location) VALUES($1, $2, $3) RETURNING id",
      [artist, title, location],
    );
    console.log(`Cd ${title} by ${artist} has been added to the db.`);
    return JSON.stringify(result.rows);
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleInsertCdsMain;
