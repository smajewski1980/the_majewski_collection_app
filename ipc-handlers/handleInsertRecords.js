const pool = require("../dbconnect.js");

/**
 * this takes the record data from
 * the form and does a db insert
 * @param {Event} e
 * @typedef {object} recordData
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @property {number} year
 * @property {string} diameter
 * @property {string} sleeve_condition
 * @property {string} record_condition
 * @property {string} label
 * @returns {number}
 */
async function handleInsertRecords(e, recordData) {
  const {
    artist,
    title,
    location,
    year,
    diameter,
    sleeve_condition,
    record_condition,
    label,
  } = recordData;

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
