const pool = require("../dbconnect.js");

async function handleInsertRecords(e, data) {
  const {
    artist,
    title,
    location,
    year,
    diameter,
    sleeve_condition,
    record_condition,
    label,
  } = data;

  try {
    const result = await pool.query(
      "INSERT INTO records(artist, title, location, year, diameter, sleeve_condition, record_condition, label) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        artist,
        title,
        location,
        year,
        diameter,
        sleeve_condition,
        record_condition,
        label,
      ],
    );
    console.log(`Record ${title} by ${artist} was added to the db.`);
    return result.rows[0].id;
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleInsertRecords;
